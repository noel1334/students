import React, { forwardRef } from 'react';
import { ResultDetail } from '@/services/resultApiService';

interface PrintableResultLayoutProps {
  resultDetail: ResultDetail;
  totalQualityPoints: number;
}

const PrintableResultLayout = forwardRef<HTMLDivElement, PrintableResultLayoutProps>(
  ({ resultDetail, totalQualityPoints }, ref) => {
    const getClassification = (cgpa: number) => {
      if (cgpa >= 4.5) return 'First Class';
      if (cgpa >= 3.5) return 'Second Class Upper';
      if (cgpa >= 2.4) return 'Second Class Lower';
      if (cgpa >= 1.5) return 'Third Class';
      return 'Pass';
    };

    const getGradeColor = (grade: string) => {
      if (grade === 'A') return '#16a34a';
      if (grade === 'F') return '#dc2626';
      return '#1f2937';
    };

    return (
      <div
        ref={ref}
        style={{
          padding: '32px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontFamily: 'Arial, sans-serif',
          minHeight: '100%',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            STUDENT RESULT STATEMENT
          </h1>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
            {resultDetail.season?.name || 'N/A'} - {resultDetail.semester?.name || 'N/A'}
          </h2>
        </div>

        {/* Student Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
          <div>
            <p style={{ margin: '4px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Student Name:</span> {resultDetail.student?.name || 'N/A'}
            </p>
            <p style={{ margin: '4px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Registration No:</span> {resultDetail.student?.regNo || 'N/A'}
            </p>
            <p style={{ margin: '4px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Department:</span> {resultDetail.department?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p style={{ margin: '4px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Programme:</span> {resultDetail.program?.name || 'N/A'}
            </p>
            <p style={{ margin: '4px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Level:</span> {resultDetail.level?.name || 'N/A'}
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px', 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Courses</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.courseScores?.length || 0}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>G.P.A</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.gpa?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>C.G.P.A</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.cgpa?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Status</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
              {resultDetail.remarks || 'N/A'}
            </p>
          </div>
        </div>

        {/* Course Table */}
        {resultDetail.courseScores && resultDetail.courseScores.length > 0 && (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>Credit</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>CA</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>Exam</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>Total</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>Grade</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>GP</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '60px' }}>QP</th>
              </tr>
            </thead>
            <tbody>
              {resultDetail.courseScores.map((course, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>
                    <div style={{ fontWeight: '500' }}>{course.courseCode}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{course.courseTitle}</div>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.credit}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.CA}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.exam}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.total}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '500', color: getGradeColor(course.grade) }}>{course.grade}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.gradePoint.toFixed(1)}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.weightedPoint.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Detailed Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '13px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1f2937', margin: '0 0 12px 0' }}>Current Semester</h4>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>Credit Units Registered: <span style={{ fontWeight: '600' }}>{resultDetail.cuAttempted}</span></p>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>Credit Units Earned: <span style={{ fontWeight: '600' }}>{resultDetail.cuPassed}</span></p>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>Total Quality Points: <span style={{ fontWeight: '600' }}>{totalQualityPoints.toFixed(2)}</span></p>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>GPA: <span style={{ fontWeight: '600' }}>{resultDetail.gpa.toFixed(2)}</span></p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1f2937', margin: '0 0 12px 0' }}>Cumulative</h4>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>Total Credit Units: <span style={{ fontWeight: '600' }}>{resultDetail.cuTotal}</span></p>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>CGPA: <span style={{ fontWeight: '600' }}>{resultDetail.cgpa.toFixed(2)}</span></p>
            <p style={{ margin: '6px 0', color: '#1f2937' }}>Remark: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{resultDetail.remarks}</span></p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1f2937', margin: '0 0 12px 0' }}>Classification</h4>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '6px 0' }}>
              {getClassification(resultDetail.cgpa)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableResultLayout.displayName = 'PrintableResultLayout';

export default PrintableResultLayout;
