import { sanityFetch, type FetchOptions } from './fetch'
import {
  allCategorySlugsQuery,
  allCourseSlugsQuery,
  allInstructorSlugsQuery,
  allLessonSlugsQuery,
  categoriesQuery,
  categoryBySlugQuery,
  courseBySlugQuery,
  coursesQuery,
  instructorBySlugQuery,
  instructorsQuery,
  lessonBySlugQuery,
  popularCoursesQuery,
} from './queries'
import type {
  Category,
  CategoryDetail,
  CourseCardSummary,
  CourseDetail,
  Instructor,
  InstructorDetail,
  Lesson,
  LessonDetail,
  LessonNavigationItem,
  LessonSummary,
  SanityImage,
} from '../types'

/**
 * Fetch all courses for catalog / listings.
 */
export async function getCourses(
  options?: FetchOptions
): Promise<CourseCardSummary[]> {
  return sanityFetch<CourseCardSummary[]>({
    query: coursesQuery,
    options: {
      tags: ['course'],
      ...options,
    },
  })
}

/**
 * Fetch featured/popular courses.
 */
export async function getPopularCourses(
  options?: FetchOptions
): Promise<CourseCardSummary[]> {
  return sanityFetch<CourseCardSummary[]>({
    query: popularCoursesQuery,
    options: {
      tags: ['course'],
      ...options,
    },
  })
}

/**
 * Fetch full course details by slug including modules and lessons.
 */
export async function getCourseBySlug(
  slug: string,
  options?: FetchOptions
): Promise<CourseDetail | null> {
  return sanityFetch<CourseDetail | null>({
    query: courseBySlugQuery,
    params: { slug },
    options: {
      tags: ['course', `course:${slug}`],
      ...options,
    },
  })
}

interface RawLessonQueryResult extends Lesson {
  course?: {
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
  } | null
}

/**
 * Fetch lesson details by slug with parent course context and computed navigation.
 */
export async function getLessonBySlug(
  slug: string,
  options?: FetchOptions
): Promise<LessonDetail | null> {
  const rawLesson = await sanityFetch<RawLessonQueryResult | null>({
    query: lessonBySlugQuery,
    params: { slug },
    options: {
      tags: ['lesson', `lesson:${slug}`],
      ...options,
    },
  })

  if (!rawLesson) {
    return null
  }

  const { course, ...lessonData } = rawLesson

  // If no parent course found via reverse reference, return minimal structure
  if (!course || !Array.isArray(course.modules)) {
    return {
      lesson: lessonData,
      course: {
        _id: '',
        title: '',
        slug: { current: '' },
        level: '',
        modules: [],
      },
      currentModule: {
        title: '',
        moduleIndex: 0,
        lessonIndex: 0,
      },
      previousLesson: null,
      nextLesson: null,
    }
  }

  // Flatten all lessons in sequence across modules to calculate next/previous
  const flatLessonSequence: LessonNavigationItem[] = []
  let currentModuleInfo = {
    title: '',
    summary: undefined as string | undefined,
    moduleIndex: 0,
    lessonIndex: 0,
  }

  course.modules.forEach((mod, modIdx) => {
    if (Array.isArray(mod.lessons)) {
      mod.lessons.forEach((l, lIdx) => {
        const item: LessonNavigationItem = {
          _id: l._id,
          title: l.title,
          slug: l.slug,
          duration: l.duration,
          freePreview: l.freePreview,
          moduleTitle: mod.title,
          moduleIndex: modIdx,
          lessonIndex: lIdx,
        }
        flatLessonSequence.push(item)

        if (l.slug?.current === slug || l._id === lessonData._id) {
          currentModuleInfo = {
            title: mod.title,
            summary: mod.summary,
            moduleIndex: modIdx,
            lessonIndex: lIdx,
          }
        }
      })
    }
  })

  const currentIndex = flatLessonSequence.findIndex(
    (item) => item.slug?.current === slug || item._id === lessonData._id
  )

  const previousLesson = currentIndex > 0 ? flatLessonSequence[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < flatLessonSequence.length - 1
      ? flatLessonSequence[currentIndex + 1]
      : null

  return {
    lesson: lessonData,
    course,
    currentModule: currentModuleInfo,
    previousLesson,
    nextLesson,
  }
}

/**
 * Fetch all course slugs for static routes.
 */
export async function getAllCourseSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: allCourseSlugsQuery,
    options: { revalidate: 3600 },
  })
}

/**
 * Fetch all lesson slugs for static routes.
 */
export async function getAllLessonSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: allLessonSlugsQuery,
    options: { revalidate: 3600 },
  })
}

/**
 * Fetch all instructor slugs for static routes.
 */
export async function getAllInstructorSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: allInstructorSlugsQuery,
    options: { revalidate: 3600 },
  })
}

/**
 * Fetch all category slugs for static routes.
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: allCategorySlugsQuery,
    options: { revalidate: 3600 },
  })
}

/**
 * Fetch all instructors.
 */
export async function getInstructors(
  options?: FetchOptions
): Promise<Instructor[]> {
  return sanityFetch<Instructor[]>({
    query: instructorsQuery,
    options: {
      tags: ['instructor'],
      ...options,
    },
  })
}

/**
 * Fetch instructor details by slug with authored courses.
 */
export async function getInstructorBySlug(
  slug: string,
  options?: FetchOptions
): Promise<InstructorDetail | null> {
  return sanityFetch<InstructorDetail | null>({
    query: instructorBySlugQuery,
    params: { slug },
    options: {
      tags: ['instructor', `instructor:${slug}`],
      ...options,
    },
  })
}

/**
 * Fetch all categories with course count.
 */
export async function getCategories(
  options?: FetchOptions
): Promise<Category[]> {
  return sanityFetch<Category[]>({
    query: categoriesQuery,
    options: {
      tags: ['category'],
      ...options,
    },
  })
}

/**
 * Fetch category by slug with filtered courses.
 */
export async function getCategoryBySlug(
  slug: string,
  options?: FetchOptions
): Promise<CategoryDetail | null> {
  return sanityFetch<CategoryDetail | null>({
    query: categoryBySlugQuery,
    params: { slug },
    options: {
      tags: ['category', `category:${slug}`],
      ...options,
    },
  })
}
