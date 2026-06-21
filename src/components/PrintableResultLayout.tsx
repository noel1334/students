import React, { forwardRef } from 'react';
import { ResultDetail } from '@/services/resultApiService';
import { UniversitySetting } from '@/services/universitySettingApiService';

interface PrintableResultLayoutProps {
  resultDetail: ResultDetail;
  totalQualityPoints: number;
  universitySettings?: UniversitySetting | null;
  studentProfileImg?: string | null;
}

const PrintableResultLayout = forwardRef<HTMLDivElement, PrintableResultLayoutProps>(
  ({ resultDetail, totalQualityPoints, universitySettings, studentProfileImg }, ref) => {
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

    const hod = resultDetail.departmentSignatures?.hod;
    const examiner = resultDetail.departmentSignatures?.examiner;

    return (
      <div
        ref={ref}
        style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontFamily: 'Arial, sans-serif',
          minHeight: '100%',
        }}
      >
        {/* Top Bar: Logo | School Info | Student Photo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ width: '70px', display: 'flex', justifyContent: 'flex-start' }}>
            {universitySettings?.logoUrl && (
              <img
                src={universitySettings.logoUrl}
                alt={universitySettings?.acronym || universitySettings?.name || 'Logo'}
                crossOrigin="anonymous"
                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
              />
            )}
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            {universitySettings?.name && (
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827', textTransform: 'uppercase' }}>
                {universitySettings.name}
              </h1>
            )}
            {universitySettings?.address && (
              <p style={{ fontSize: '11px', color: '#374151', margin: '2px 0 0 0' }}>{universitySettings.address}</p>
            )}
            {(universitySettings?.email || universitySettings?.phone) && (
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '1px 0 0 0' }}>
                {universitySettings.email}{universitySettings.email && universitySettings.phone ? ' • ' : ''}{universitySettings.phone}
              </p>
            )}
          </div>
          <div style={{ width: '70px', display: 'flex', justifyContent: 'flex-end' }}>
            {studentProfileImg ? (
              <img
                src={studentProfileImg}
                alt={resultDetail.student?.name || 'Student'}
                crossOrigin="anonymous"
                style={{ width: '60px', height: '70px', objectFit: 'cover', border: '1px solid #d1d5db' }}
              />
            ) : (
              <div style={{ width: '60px', height: '70px', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#9ca3af', textAlign: 'center' }}>
                Photo
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Student Result Statement
          </h2>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#374151', margin: '2px 0 0 0' }}>
            {resultDetail.season?.name || 'N/A'} — {resultDetail.semester?.name || 'N/A'}
          </p>
        </div>

        {/* Student Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '12px' }}>
          <div>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Student Name:</span> {resultDetail.student?.name || 'N/A'}
            </p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Registration No:</span> {resultDetail.student?.regNo || 'N/A'}
            </p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Department:</span> {resultDetail.department?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Programme:</span> {resultDetail.program?.name || 'N/A'}
            </p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>
              <span style={{ fontWeight: '600' }}>Level:</span> {resultDetail.level?.name || 'N/A'}
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px', 
          marginBottom: '12px', 
          padding: '8px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: '600' }}>Courses</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.courseScores?.length || 0}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: '600' }}>G.P.A</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.gpa?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: '600' }}>C.G.P.A</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {resultDetail.cgpa?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: '600' }}>Status</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
              {resultDetail.remarks || 'N/A'}
            </p>
          </div>
        </div>

        {/* Course Table */}
        {resultDetail.courseScores && resultDetail.courseScores.length > 0 && (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontSize: '11px',
            marginBottom: '12px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '6px 6px', textAlign: 'left', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '50px' }}>Credit</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '40px' }}>CA</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '50px' }}>Exam</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '50px' }}>Total</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '50px' }}>Grade</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '40px' }}>GP</th>
                <th style={{ padding: '6px 4px', textAlign: 'center', borderBottom: '2px solid #d1d5db', color: '#374151', fontWeight: '600', width: '40px' }}>QP</th>
              </tr>
            </thead>
            <tbody>
              {resultDetail.courseScores.map((course, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{ padding: '5px 6px', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>
                    <div style={{ fontWeight: '500' }}>{course.courseCode}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{course.courseTitle}</div>
                  </td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.credit}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.CA}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.exam}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.total}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: '500', color: getGradeColor(course.grade) }}>{course.grade}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.gradePoint.toFixed(1)}</td>
                  <td style={{ padding: '5px 4px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{course.weightedPoint.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Detailed Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
          <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 6px 0', fontSize: '12px' }}>Current Semester</h4>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>Credit Units Registered: <span style={{ fontWeight: '600' }}>{resultDetail.cuAttempted}</span></p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>Credit Units Earned: <span style={{ fontWeight: '600' }}>{resultDetail.cuPassed}</span></p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>Total Quality Points: <span style={{ fontWeight: '600' }}>{totalQualityPoints.toFixed(2)}</span></p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>GPA: <span style={{ fontWeight: '600' }}>{resultDetail.gpa.toFixed(2)}</span></p>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 6px 0', fontSize: '12px' }}>Cumulative</h4>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>Total Credit Units: <span style={{ fontWeight: '600' }}>{resultDetail.cuTotal}</span></p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>CGPA: <span style={{ fontWeight: '600' }}>{resultDetail.cgpa.toFixed(2)}</span></p>
            <p style={{ margin: '2px 0', color: '#1f2937' }}>Remark: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{resultDetail.remarks}</span></p>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 6px 0', fontSize: '12px' }}>Classification</h4>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: '2px 0' }}>
              {getClassification(resultDetail.cgpa)}
            </p>
          </div>
        </div>

        {/* Signatures */}
        {(examiner || hod) && (
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {examiner && (
              <div style={{ textAlign: 'center' }}>
                {examiner.signatureImg && (
                  <img
                    src={examiner.signatureImg}
                    alt="Examiner signature"
                    crossOrigin="anonymous"
                    style={{ height: '40px', objectFit: 'contain', margin: '0 auto 2px', display: 'block' }}
                  />
                )}
                <div style={{ borderTop: '1px solid #1f2937', paddingTop: '4px', fontSize: '11px' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{examiner.name}</p>
                  <p style={{ margin: '1px 0 0 0', fontSize: '10px', color: '#6b7280' }}>Examiner</p>
                </div>
              </div>
            )}
            {hod && (
              <div style={{ textAlign: 'center', gridColumn: examiner ? 'auto' : '2' }}>
                {hod.signatureImg && (
                  <img
                    src={hod.signatureImg}
                    alt="HOD signature"
                    crossOrigin="anonymous"
                    style={{ height: '40px', objectFit: 'contain', margin: '0 auto 2px', display: 'block' }}
                  />
                )}
                <div style={{ borderTop: '1px solid #1f2937', paddingTop: '4px', fontSize: '11px' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{hod.name}</p>
                  <p style={{ margin: '1px 0 0 0', fontSize: '10px', color: '#6b7280' }}>Head of Department</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PrintableResultLayout.displayName = 'PrintableResultLayout';

export default PrintableResultLayout;
