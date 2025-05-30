import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  Grade,
  ClassSection,
  Student,
  gradeApi,
  classSectionApi,
  studentApi,
} from '../services/api';

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [bulkGrades, setBulkGrades] = useState<{ [key: number]: string }>({});
  const [open, setOpen] = useState(false);

  const fetchSections = async () => {
    try {
      const response = await classSectionApi.getAll();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchGrades = async (sectionId: number) => {
    try {
      const response = await gradeApi.getSectionGrades(sectionId);
      setGrades(response.data);
      
      // Initialize bulk grades with existing grades
      const initialGrades: { [key: number]: string } = {};
      response.data.forEach((grade) => {
        initialGrades[grade.student] = grade.score.toString();
      });
      setBulkGrades(initialGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchGrades(parseInt(selectedSection));
    }
  }, [selectedSection]);

  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
  };

  const handleGradeChange = (studentId: number, value: string) => {
    setBulkGrades((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSection) return;

    const gradesToSubmit = Object.entries(bulkGrades).map(([studentId, score]) => ({
      student: parseInt(studentId),
      class_section: parseInt(selectedSection),
      score: parseFloat(score),
    }));

    try {
      await gradeApi.bulkCreate(gradesToSubmit);
      fetchGrades(parseInt(selectedSection));
      setOpen(false);
    } catch (error) {
      console.error('Error saving grades:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>选择班次</InputLabel>
          <Select
            value={selectedSection}
            label="选择班次"
            onChange={handleSectionChange}
          >
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.course_name} - {section.section_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedSection && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setOpen(true)}>
              批量录入成绩
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>学号</TableCell>
                  <TableCell>姓名</TableCell>
                  <TableCell>成绩</TableCell>
                  <TableCell>更新时间</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.student_name}</TableCell>
                    <TableCell>{grade.student_name}</TableCell>
                    <TableCell>{grade.score}</TableCell>
                    <TableCell>
                      {new Date(grade.updated_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>批量录入成绩</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {sections.find((s) => s.id === parseInt(selectedSection))?.course_name} -{' '}
                  {sections.find((s) => s.id === parseInt(selectedSection))?.section_name}
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>学号</TableCell>
                        <TableCell>姓名</TableCell>
                        <TableCell>成绩</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={bulkGrades[student.id] || ''}
                              onChange={(e) =>
                                handleGradeChange(student.id, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                max: 100,
                                step: 0.1,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button onClick={handleSubmit} variant="contained">
                保存
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Grades; 