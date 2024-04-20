export interface ILanguage {
  id: number
  name: string
  icon: string
  is_active: boolean
  order_number: number
  release_progress: number
}

export interface IProfile {
  id: number
  first_name: string
  last_name: string
  rank_score: number
  invitation: ICoupon | undefined
  is_push_enabled: boolean
  push_hash: string
  date_joined: number
  is_me: boolean
}

export interface ICoupon {
  accepted_by: string
  accepted_time: number
  code: string
}

export interface IPreferences {
  primary_topic: ILanguage
}

export interface IRiddle {
  content: string
  content_type: string
  language: string
}

export interface IOption {
  id: number
  option: string
}

export interface IChallenge {
  id: number
  riddle: IRiddle[]
  options: IOption[]
}

export interface IMatch {
  you: IProfile
  opponent: IProfile
  challenges: IChallenge[]
  topic: ILanguage
  is_friendly_match: boolean
  is_against_computer: boolean
  started_time: number
  computer_movements: {
    is_correct: false
    time_spent: number
  }[]
}

export interface IResponse {
  challenge_id: number
  is_correct: boolean
  option_id: number
}

export interface IMatchResult {
  your_responses: IResponse[]
  opponent_responses: IResponse[]
  winner: "you" | "opponent" | "both" | "none"
  your_rank_score_change: number
  opponent_rank_score_change: number
  your_score: number
  opponent_score: number
}

export interface ILeaderBoardItem extends IProfile {
  isDivider?: boolean
  rank_number?: number
}

export interface IMatchAnswer {
  challenge_id: number
  option_id: number
}

export interface IState {
  action_started_time: number
  last_updated_time: number
  current_step_updated_time: number
  user: IProfile
  opponent: IProfile
  type:
    | "no_ongoing_event"
    | "ongoing_match"
    | "ongoing_search"
    | "ongoing_search_confirmation"

  current_step: number
  current_opponent_step: number
  event_key: string
}

export interface IMatchState {
  startedTime: number
  stepUpdatedTime: number
  answers: IMatchAnswer[]

  step: number
  opponentStep: number
  matchKey: string
}

export interface IMatchResultState {
  matchKey: string
}

export type FriendStatus =
  | "offline"
  | "searching"
  | "friendly_challenge_queue"
  | "dueling"
  | "online"

export interface IFriend extends IProfile {
  status: FriendStatus
  rank_number: number
  last_beat: number
  is_me: boolean
}

export interface IMatchRequest {
  challenger: IFriend
  language: ILanguage
  request_id: number
  accepting?: boolean
}

export interface IMonthlyActivity {
  date: string
  matches: number
}

export interface IMonthlyActivityPrepared {
  date: string
  activity: number
  matches: number
  is_today: boolean
  shown: boolean
}

export interface IStats {
  summary: {
    matches: number
    total_wins: number
    total_score: number
  }
  monthly_activity: IMonthlyActivity[]
}

export interface IStatsPrepared {
  summary: {
    matches: number
    total_wins: number
    total_score: number
  }
  monthly_activity: IMonthlyActivityPrepared[]
}

export interface INotification {
  id: number
  title: string
  short_description: string
  body: string
  published_time: number
  is_read: boolean
}

export interface IServerState {
  state: "up" | "pending_maintenance" | "maintenance"
  from_time: number
  to_time: number
}

export interface IContacts {
  tg_channel_link: string
  tg_beta_group_link: string
  tg_bot_link: string
  homepage_link: string
}
