import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
  courseCount?: number
}

export interface Instructor {
  _id: string
  _type: 'instructor'
  name: string
  slug: { current: string }
  photo?: SanityImage
  expertise?: string
  bio?: PortableTextBlock[] | string
}

export interface LearningOutcome {
  _key?: string
  icon: string
  title: string
  description?: string
}

export interface Resource {
  _key?: string
  type: 'github' | 'docs' | 'download' | 'link' | 'code' | string
  title: string
  description?: string
  url: string
}

export interface LessonSummary {
  _id: string
  _type: 'lesson'
  title: string
  slug: { current: string }
  duration?: string
  freePreview?: boolean
  studentCount?: number
  poster?: SanityImage
}

export interface Lesson extends LessonSummary {
  videoUrl?: string
  notes?: PortableTextBlock[]
  keyPoints?: string[]
  proTip?: string
  resources?: Resource[]
}

export interface ModuleSummary {
  _key?: string
  title: string
  summary?: string
  lessons: LessonSummary[]
}

export interface CourseCardSummary {
  _id: string
  _type: 'course'
  title: string
  slug: { current: string }
  summary: string
  coverImage?: SanityImage
  icon?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  price: number
  duration?: string
  popular?: boolean
  studentCount?: number
  category?: {
    title: string
    slug: { current: string }
  }
  instructor?: {
    name: string
    slug: { current: string }
    photo?: SanityImage
    expertise?: string
  }
  moduleCount: number
  lessonCount: number
}

export interface CourseDetail {
  _id: string
  _type: 'course'
  title: string
  slug: { current: string }
  summary: string
  coverImage?: SanityImage
  icon?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  price: number
  duration?: string
  popular?: boolean
  studentCount?: number
  category?: Category
  instructor?: Instructor
  learningOutcomes?: LearningOutcome[]
  modules: {
    _key?: string
    title: string
    summary?: string
    lessons: Lesson[]
  }[]
  totalLessons: number
  totalModules: number
}

export interface LessonNavigationItem {
  _id: string
  title: string
  slug: { current: string }
  duration?: string
  freePreview?: boolean
  moduleTitle: string
  moduleIndex: number
  lessonIndex: number
}

export interface LessonDetail {
  lesson: Lesson
  course: {
    _id: string
    title: string
    slug: { current: string }
    icon?: string
    level: string
    instructor?: {
      name: string
      slug: { current: string }
      photo?: SanityImage
      expertise?: string
    }
    modules: {
      _key?: string
      title: string
      summary?: string
      lessons: LessonSummary[]
    }[]
  }
  currentModule: {
    title: string
    summary?: string
    moduleIndex: number
    lessonIndex: number
  }
  previousLesson?: LessonNavigationItem | null
  nextLesson?: LessonNavigationItem | null
}

export interface InstructorDetail extends Instructor {
  courses: CourseCardSummary[]
}

export interface CategoryDetail extends Category {
  courses: CourseCardSummary[]
}
