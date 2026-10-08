-- ============================================================================
-- SNT-307 / SNT-308 / SNT-311: Community P2 Guardrails (Additive Migration)
-- 1. 3-Bestätigungen-Schwelle & Anti-Spoofing für Spots
-- 2. Rate-Limits für Nachrichten (20/h) und neue Kontakte (5/d)
-- ============================================================================

-- 1. Anti-Spoofing: Ersteller kann eigenen Spot nicht verifizieren (SNT-308)
CREATE OR REPLACE FUNCTION public.guard_spot_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_creator UUID;
BEGIN
  SELECT created_by INTO v_creator FROM public.secret_spots WHERE id = NEW.spot_id;
  IF v_creator = NEW.user_id THEN
    RAISE EXCEPTION 'Ersteller kann den eigenen Spot nicht verifizieren.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS spot_verification_guard ON public.spot_verifications;
CREATE TRIGGER spot_verification_guard
  BEFORE INSERT ON public.spot_verifications
  FOR EACH ROW EXECUTE FUNCTION public.guard_spot_verification();

-- 2. 3-Bestätigungen-Schwelle: Automatische Beförderung zu community_verified (SNT-307)
CREATE OR REPLACE FUNCTION public.sync_spot_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.spot_verifications WHERE spot_id = NEW.spot_id;
  UPDATE public.secret_spots
  SET verified_by_count = v_count,
      verification_state = CASE
        WHEN v_count >= 3 AND verification_state = 'unverified' THEN 'community_verified'
        ELSE verification_state
      END
  WHERE id = NEW.spot_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS spot_verification_sync ON public.spot_verifications;
CREATE TRIGGER spot_verification_sync
  AFTER INSERT OR DELETE ON public.spot_verifications
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_verification();

-- 3. Rate-Limits für Nachrichten: Max 20 Nachrichten pro Stunde (SNT-311)
CREATE OR REPLACE FUNCTION public.check_message_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_recent_count INT;
BEGIN
  SELECT count(*) INTO v_recent_count
  FROM public.messages
  WHERE sender_id = NEW.sender_id
    AND created_at > now() - interval '1 hour';

  IF v_recent_count >= 20 THEN
    RAISE EXCEPTION 'Rate-Limit erreicht: Maximal 20 Nachrichten pro Stunde erlaubt.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS message_rate_limit ON public.messages;
CREATE TRIGGER message_rate_limit
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.check_message_rate_limit();

-- 4. Rate-Limits für neue Kontakte: Max 5 neue Unterhaltungen pro Tag (SNT-311)
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_daily_contacts INT;
BEGIN
  SELECT count(DISTINCT conversation_id) INTO v_daily_contacts
  FROM public.conversation_members
  WHERE user_id = NEW.user_id
    AND conversation_id IN (
      SELECT id FROM public.conversations WHERE created_at > now() - interval '1 day'
    );

  IF v_daily_contacts >= 5 THEN
    RAISE EXCEPTION 'Rate-Limit erreicht: Maximal 5 neue Kontakte pro Tag erlaubt.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_rate_limit ON public.conversation_members;
CREATE TRIGGER contact_rate_limit
  BEFORE INSERT ON public.conversation_members
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();
