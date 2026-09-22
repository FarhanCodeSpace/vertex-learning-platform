import { defineQuery } from 'next-sanity'

// Fetch all courses for catalog / listings
export const coursesQuery = defineQuery(`
  *[_type == "course"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    icon,
    level,
    price,
    duration,
    popular,
    studentCount,
    category->{
      title,
      slug
    },
    instructor->{
      name,
      slug,
      photo,
      expertise
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

// Fetch popular / featured courses
export const popularCoursesQuery = defineQuery(`
  *[_type == "course" && popular == true] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    icon,
    level,
    price,
    duration,
    popular,
    studentCount,
    category->{
      title,
      slug
    },
    instructor->{
      name,
      slug,
      photo,
      expertise
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

// Fetch full course details by slug with populated modules and lessons
export const courseBySlugQuery = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    icon,
    level,
    price,
    duration,
    popular,
    studentCount,
    category->{
      _id,
      _type,
      title,
      slug,
      description
    },
    instructor->{
      _id,
      _type,
      name,
      slug,
      photo,
      expertise,
      bio
    },
    learningOutcomes,
    modules[] {
      _key,
      title,
      summary,
      lessons[]->{
        _id,
        _type,
        title,
        slug,
        duration,
        freePreview,
        studentCount,
        poster,
        videoUrl,
        keyPoints,
        proTip,
        notes,
        resources
      }
    },
    "totalModules": count(modules),
    "totalLessons": count(modules[].lessons[])
  }
`)

// Fetch lesson details by slug with parent course context
export const lessonBySlugQuery = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    videoUrl,
    poster,
    duration,
    freePreview,
    studentCount,
    keyPoints,
    proTip,
    notes,
    resources,
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      icon,
      level,
      instructor->{
        name,
        slug,
        photo,
        expertise
      },
      modules[] {
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          _type,
          title,
          slug,
          duration,
          freePreview,
          studentCount,
          poster
        }
      }
    }
  }
`)

// Static route parameter helpers
export const allCourseSlugsQuery = defineQuery(`
  *[_type == "course" && defined(slug.current)][].slug.current
`)

export const allLessonSlugsQuery = defineQuery(`
  *[_type == "lesson" && defined(slug.current)][].slug.current
`)

export const allInstructorSlugsQuery = defineQuery(`
  *[_type == "instructor" && defined(slug.current)][].slug.current
`)

export const allCategorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)][].slug.current
`)

// Fetch instructors
export const instructorsQuery = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio
  }
`)

// Fetch single instructor by slug with authored courses
export const instructorBySlugQuery = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && instructor._ref == ^._id] {
      _id,
      _type,
      title,
      slug,
      summary,
      coverImage,
      icon,
      level,
      price,
      duration,
      popular,
      studentCount,
      category->{
        title,
        slug
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

// Fetch categories with course counts
export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    description,
    "courseCount": count(*[_type == "course" && category._ref == ^._id])
  }
`)

// Fetch single category by slug with courses
export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    description,
    "courses": *[_type == "course" && category._ref == ^._id] {
      _id,
      _type,
      title,
      slug,
      summary,
      coverImage,
      icon,
      level,
      price,
      duration,
      popular,
      studentCount,
      instructor->{
        name,
        slug,
        photo,
        expertise
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }
`)
