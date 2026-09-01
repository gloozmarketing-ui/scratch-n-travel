import React, { createContext, useContext, useState, useEffect } from 'react'
import { allBadges, BadgeItem } from '../data/allBadges'

export interface PassportStamp {
  id: string
  city: string
  country: string
  flag: string
  date: string
  secretName: string
  gps: string
  xpEarned: number
  category: string
  color: string
}

export interface Quest {
  id: string
  title: string
  city: string
  rewardBadgeId: string
  rewardBadgeName: string
  xp: number
  steps: { id: number; text: string; done: boolean }[]
  completed: boolean
}

export interface HostReservation {
  id: string
  hostBusiness: string
  city: string
  guestName: string
  email: string
  date: string
  time: string
  guests: number
  category: string
  notes: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
}

export interface FeedItem {
  id: string
  userName: string
  avatar: string
  action: string
  target: string
  location: string
  time: string
  likes: number
  liked?: boolean
}

export interface UserProfile {
  name: string
  handle: string
  initials: string
  rank: string
  level: number
  xp: number
  xpNext: number
  joinDate: string
  bio: string
  hobbies: string[]
  countriesCount: number
  secretsCount: number
  badgesCount: number
  storiesCount: number
}

interface TravelContextType {
  user: UserProfile
  badges: BadgeItem[]
  stamps: PassportStamp[]
  quests: Quest[]
  reservations: HostReservation[]
  feed: FeedItem[]
  scratchedIds: number[]
  revealedPins: number[]
  triggerHaptic: (pattern?: number | number[]) => void
  scratchSecret: (id: number, xpReward: number, locationName: string, gps: string, category: string) => void
  unlockBadge: (badgeId: string) => void
  completeQuestStep: (questId: string, stepId: number) => void
  createReservation: (res: Omit<HostReservation, 'id' | 'status' | 'createdAt'>) => void
  likeFeedItem: (id: string) => void
}

const initialStamps: PassportStamp[] = [
  { id: 'S01', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', date: '12.09.2025', secretName: 'Alfama Hidden Bacalhau', gps: "38°42'44\"N · 9°07'59\"W", xpEarned: 120, category: 'Food', color: '#C9A84C' },
  { id: 'S02', city: 'Sintra', country: 'Portugal', flag: '🇵🇹', date: '15.09.2025', secretName: 'Pena Secret Forest Chapel', gps: "38°47'24\"N · 9°23'21\"W", xpEarned: 150, category: 'Nature', color: '#3A6B4A' },
  { id: 'S03', city: 'Kyoto', country: 'Japan', flag: '🇯🇵', date: '15.07.2025', secretName: 'Bamboo Grove Moon Gate', gps: "35°00'58\"N · 135°40'30\"E", xpEarned: 250, category: 'Culture', color: '#8B3A2A' },
  { id: 'S04', city: 'Ubud', country: 'Indonesia', flag: '🇮🇩', date: '28.06.2025', secretName: 'Hidden Waterfall Gorge', gps: "8°30'22\"S · 115°15'44\"E", xpEarned: 200, category: 'Nature', color: '#2A7B9B' },
  { id: 'S05', city: 'Ericeira', country: 'Portugal', flag: '🇵🇹', date: '10.04.2026', secretName: 'Praia do Peixe Natural Pool', gps: "38°57'50\"N · 9°25'03\"W", xpEarned: 110, category: 'Surf', color: '#C9A84C' },
]

const initialQuests: Quest[] = [
  {
    id: 'Q01',
    title: 'Lisbon Secret Hunter Quest',
    city: 'Lisboa, Portugal',
    rewardBadgeId: 'B449',
    rewardBadgeName: 'Geheimtipp-Entdecker',
    xp: 350,
    completed: false,
    steps: [
      { id: 1, text: 'Enthülle das Bacalhau-Geheimnis in der Alfama', done: true },
      { id: 2, text: 'Finde die Klippenquelle bei Praia da Ursa', done: true },
      { id: 3, text: 'Besuche die geheime Waldkapelle in Sintra', done: false },
      { id: 4, text: 'Genieße den Sonnenuntergang am Miradouro de Santa Catarina', done: false },
    ],
  },
  {
    id: 'Q02',
    title: 'Atlantic Surf Pioneer',
    city: 'Ericeira & Nazaré',
    rewardBadgeId: 'B450',
    rewardBadgeName: 'Monsterwellen-Zeuge',
    xp: 400,
    completed: false,
    steps: [
      { id: 1, text: 'Checke den Nazaré Cliff-Viewpoint bei Flut', done: true },
      { id: 2, text: 'Schwimme im Devil’s Pool von Ericeira', done: false },
      { id: 3, text: 'Tausche Wellen-Tipps mit einem Local Surfer aus', done: false },
    ],
  },
  {
    id: 'Q03',
    title: 'Pet & Family Trail Master',
    city: 'Sintra & Cascais',
    rewardBadgeId: 'B460',
    rewardBadgeName: 'Tierfreundlicher Begleiter',
    xp: 250,
    completed: true,
    steps: [
      { id: 1, text: 'Wandere den hundefreundlichen Monsanto Trail', done: true },
      { id: 2, text: 'Mache Pause an einer schattigen Trinkquelle', done: true },
    ],
  },
]

const initialFeed: FeedItem[] = [
  { id: 'f1', userName: 'Maria Santos', avatar: 'MS', action: 'hat einen neuen Stempel gesammelt', target: 'Praia da Ursa Klippenquelle', location: 'Sintra, PT', time: 'vor 12 Min.', likes: 14 },
  { id: 'f2', userName: 'Igor Becker', avatar: 'IB', action: 'hat den Meilenstein freigeschaltet', target: 'Zehnfach-Reisender 🏆', location: 'Global', time: 'vor 45 Min.', likes: 38 },
  { id: 'f3', userName: 'Ana & Pedro', avatar: 'AP', action: 'haben eine neue Tour erstellt', target: 'Ericeira Sunrise Coast Walk', location: 'Ericeira, PT', time: 'vor 2 Std.', likes: 21 },
  { id: 'f4', userName: 'Sofia Chen', avatar: 'SC', action: 'meldete eine Strömungswarnung', target: 'Guincho Beach Riptide ⚠️', location: 'Cascais, PT', time: 'vor 4 Std.', likes: 52 },
]

const TravelContext = createContext<TravelContextType | undefined>(undefined)

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('snt_user')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
      name: 'Andrey Test',
      handle: '@andrey.test',
      initials: 'AT',
      rank: 'Grandmaster Explorer & Founder',
      level: 25,
      xp: 24850,
      xpNext: 25000,
      joinDate: 'Januar 2024',
      bio: 'Gründer & Master Explorer. Vollzugriff auf alle 460+ Badges, weltweite Secret Spots, GPX-Routen und B2B Host-Tools.',
      hobbies: [
        'Surfing',
        'Hundewandern',
        'Kinderwagen-Klippenpfade',
        'Drone Photography & Film',
        'Wine Tasting & Weingut-Hopping',
        'Vanlife & Camper-Ausbau',
        'Sportklettern',
        'Thermalquellen & Hot Springs'
      ],
      countriesCount: 48,
      secretsCount: 120,
      badgesCount: 184,
      storiesCount: 24,
    }
  })

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('snt_badges')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return allBadges
  })

  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    const saved = localStorage.getItem('snt_stamps')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return initialStamps
  })

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('snt_quests')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return initialQuests
  })

  const [reservations, setReservations] = useState<HostReservation[]>(() => {
    const saved = localStorage.getItem('snt_reservations')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return [
      {
        id: 'RES-101',
        hostBusiness: 'Surf School Ericeira',
        city: 'Ericeira',
        guestName: 'Maria Santos',
        email: 'maria@wanderer.eu',
        date: '2026-09-18',
        time: '10:00',
        guests: 2,
        category: 'Surf Coaching & Board Rental',
        notes: 'Intermediate level, require 7ft hardboards.',
        status: 'confirmed',
        createdAt: '2026-09-01',
      },
    ]
  })

  const [feed, setFeed] = useState<FeedItem[]>(initialFeed)
  const [scratchedIds, setScratchedIds] = useState<number[]>([1, 5, 6])
  const [revealedPins, setRevealedPins] = useState<number[]>([1, 3, 5])

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('snt_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('snt_badges', JSON.stringify(badges))
  }, [badges])

  useEffect(() => {
    localStorage.setItem('snt_stamps', JSON.stringify(stamps))
  }, [stamps])

  useEffect(() => {
    localStorage.setItem('snt_quests', JSON.stringify(quests))
  }, [quests])

  useEffect(() => {
    localStorage.setItem('snt_reservations', JSON.stringify(reservations))
  }, [reservations])

  const triggerHaptic = (pattern: number | number[] = 20) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern) } catch (e) {}
    }
  }

  const scratchSecret = (id: number, xpReward: number, locationName: string, gps: string, category: string) => {
    if (scratchedIds.includes(id)) return
    triggerHaptic([30, 40, 50])
    setScratchedIds(prev => [...prev, id])
    setRevealedPins(prev => [...prev, id])

    // Update user XP & stats
    setUser(prev => {
      const newXp = prev.xp + xpReward
      let newLvl = prev.level
      let newNext = prev.xpNext
      let newRank = prev.rank

      if (newXp >= prev.xpNext) {
        newLvl += 1
        newNext = Math.round(prev.xpNext * 1.5)
        newRank = `Explorer Rang ${newLvl} · Master Voyager`
        triggerHaptic([50, 100, 50, 100])
      }

      return {
        ...prev,
        xp: newXp,
        level: newLvl,
        xpNext: newNext,
        rank: newRank,
        secretsCount: prev.secretsCount + 1,
      }
    })

    // Mint new passport stamp
    const newStamp: PassportStamp = {
      id: `S${Date.now()}`,
      city: locationName.split(',')[0] || 'Portugal',
      country: 'Portugal',
      flag: '🇵🇹',
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      secretName: locationName,
      gps,
      xpEarned: xpReward,
      category,
      color: '#C9A84C',
    }
    setStamps(prev => [newStamp, ...prev])

    // Push to activity feed
    setFeed(prev => [
      {
        id: `f${Date.now()}`,
        userName: user.name,
        avatar: user.initials,
        action: 'hat ein neues Geheimnis freigerubbelt',
        target: `${locationName} (+${xpReward} XP)`,
        location: 'Portugal',
        time: 'Gerade eben',
        likes: 1,
      },
      ...prev,
    ])
  }

  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlocked: true, dateUnlocked: new Date().toISOString().split('T')[0] } : b))
    )
    setUser(prev => ({ ...prev, badgesCount: prev.badgesCount + 1 }))
    triggerHaptic([40, 60, 80])
  }

  const completeQuestStep = (questId: string, stepId: number) => {
    triggerHaptic(25)
    setQuests(prev =>
      prev.map(q => {
        if (q.id !== questId) return q
        const updatedSteps = q.steps.map(s => (s.id === stepId ? { ...s, done: !s.done } : s))
        const allDone = updatedSteps.every(s => s.done)
        if (allDone && !q.completed) {
          unlockBadge(q.rewardBadgeId)
          setUser(u => ({ ...u, xp: u.xp + q.xp }))
        }
        return { ...q, steps: updatedSteps, completed: allDone }
      })
    )
  }

  const createReservation = (res: Omit<HostReservation, 'id' | 'status' | 'createdAt'>) => {
    const newRes: HostReservation = {
      ...res,
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setReservations(prev => [newRes, ...prev])
    triggerHaptic([30, 60])
  }

  const likeFeedItem = (id: string) => {
    triggerHaptic(15)
    setFeed(prev =>
      prev.map(f => {
        if (f.id !== id) return f
        const isLiked = f.liked
        return { ...f, liked: !isLiked, likes: isLiked ? f.likes - 1 : f.likes + 1 }
      })
    )
  }

  return (
    <TravelContext.Provider
      value={{
        user,
        badges,
        stamps,
        quests,
        reservations,
        feed,
        scratchedIds,
        revealedPins,
        triggerHaptic,
        scratchSecret,
        unlockBadge,
        completeQuestStep,
        createReservation,
        likeFeedItem,
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}

export function useTravel() {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error('useTravel must be used within a TravelProvider')
  return ctx
}
