import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface ExamAssignmentFiltersProps {
  courseFilter: string;
  dateFilter: string;
  statusFilter: string;
  onCourseChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  availableCourses: { code: string; title: string }[];
}

export const ExamAssignmentFilters = ({
  courseFilter,
  dateFilter,
  statusFilter,
  onCourseChange,
  onDateChange,
  onStatusChange,
  availableCourses,
}: ExamAssignmentFiltersProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0" />
          <span className="truncate">Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Course Filter */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Course</label>
            <Select value={courseFilter} onValueChange={onCourseChange}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" className="max-w-[--radix-select-trigger-width]">
                <SelectItem value="all" className="text-xs sm:text-sm">All Courses</SelectItem>
                {availableCourses.map((course) => (
                  <SelectItem key={course.code} value={course.code} className="text-xs sm:text-sm truncate">
                    <span className="truncate">{course.code} - {course.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Date</label>
            <Select value={dateFilter} onValueChange={onDateChange}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" className="max-w-[--radix-select-trigger-width]">
                <SelectItem value="all" className="text-xs sm:text-sm">All Dates</SelectItem>
                <SelectItem value="upcoming" className="text-xs sm:text-sm">Upcoming</SelectItem>
                <SelectItem value="today" className="text-xs sm:text-sm">Today</SelectItem>
                <SelectItem value="this-week" className="text-xs sm:text-sm">This Week</SelectItem>
                <SelectItem value="this-month" className="text-xs sm:text-sm">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Status</label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" className="max-w-[--radix-select-trigger-width]">
                <SelectItem value="all" className="text-xs sm:text-sm">All Status</SelectItem>
                <SelectItem value="active" className="text-xs sm:text-sm">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs sm:text-sm">Inactive</SelectItem>
                <SelectItem value="completed" className="text-xs sm:text-sm">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
