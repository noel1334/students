
// import React from 'react';
// import { BookOpen, Clock, Users } from 'lucide-react';

// type Course = {
//   id: string;
//   code: string;
//   title: string;
//   creditUnits: number;
//   instructor: string;
//   schedule: string;
//   progress: number;
// };

// const CourseList = () => {
//   // This would come from an API in a real application
//   const courses: Course[] = [
//     {
//       id: '1',
//       code: 'CSC301',
//       title: 'Data Structures and Algorithms',
//       creditUnits: 3,
//       instructor: 'Dr. Smith',
//       schedule: 'Mon/Wed 10:00AM - 12:00PM',
//       progress: 65,
//     },
//     {
//       id: '2',
//       code: 'CSC315',
//       title: 'Database Management Systems',
//       creditUnits: 3,
//       instructor: 'Prof. Johnson',
//       schedule: 'Tue/Thu 2:00PM - 4:00PM',
//       progress: 80,
//     },
//     {
//       id: '3',
//       code: 'CSC320',
//       title: 'Software Engineering',
//       creditUnits: 4,
//       instructor: 'Dr. Williams',
//       schedule: 'Mon/Fri 1:00PM - 3:00PM',
//       progress: 45,
//     },
//     {
//       id: '4',
//       code: 'CSC350',
//       title: 'Computer Networks',
//       creditUnits: 3,
//       instructor: 'Prof. Brown',
//       schedule: 'Wed/Fri 9:00AM - 11:00AM',
//       progress: 30,
//     },
//   ];

//   return (
//     <div className="dashboard-card">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Registered Courses</h2>
//         <span className="text-sm text-muted-foreground">Current Semester</span>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {courses.map((course) => (
//           <div key={course.id} className="border border-border rounded-md p-4 hover:border-primary/50 transition-colors">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-bold text-primary">{course.code}</span>
//                   <span className="bg-secondary text-xs px-2 py-0.5 rounded-full">
//                     {course.creditUnits} Units
//                   </span>
//                 </div>
//                 <h3 className="font-medium mt-1">{course.title}</h3>
//               </div>
//             </div>
            
//             <div className="mt-4 space-y-2">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Users size={16} />
//                 <span>{course.instructor}</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Clock size={16} />
//                 <span>{course.schedule}</span>
//               </div>
//             </div>
            
//             <div className="mt-4">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Progress</span>
//                 <span className="font-medium">{course.progress}%</span>
//               </div>
//               <div className="w-full bg-secondary rounded-full h-2">
//                 <div 
//                   className="bg-primary rounded-full h-2" 
//                   style={{ width: `${course.progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="mt-4 text-center">
//         <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 mx-auto">
//           <BookOpen size={16} />
//           <span>View All Courses</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CourseList;
