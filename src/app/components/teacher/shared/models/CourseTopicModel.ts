export interface CourseTopicModel{
  code: number,
  bpcId: number,
  courseName: String,
  courseId: number,
  topicsCompleted: String[],
  topicsInProgress: any[],
  totalTopics: number,
  totalPercentage: number,
  courseCompletionPercentage: number
}
