'use client'

import React from 'react';
import ReactDOM from 'react-dom';

import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const NotePDF = ({appointment}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Appointment Date: {appointment.appointment_date}</Text>
        <Text>Appointment Time: {appointment.appointment_time}</Text>
        <Text>Patient Name: {appointment.patient_name}</Text>
        <Text>Patient Date of Birth: {appointment.patient_date_of_birth}</Text>
        {/* Add more fields as needed */}
      </View>
    </Page>
  </Document>
);

export default NotePDF