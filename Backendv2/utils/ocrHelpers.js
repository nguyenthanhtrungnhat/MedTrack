const { exec } = require('child_process');

const convertPdfToImage = (pdfPath) =>
  new Promise((resolve, reject) => {
    const output = pdfPath.replace('.pdf', '');
    exec(`pdftoppm -png "${pdfPath}" "${output}"`, (err) => {
      if (err) return reject(err);
      resolve(`${output}-1.png`);
    });
  });

const parseForm = (text) => {
  const get = (label) => {
    const match = text.match(new RegExp(label + '.*?:\\s*(.+)', 'i'));
    return match ? match[1].trim() : '';
  };
  return {
    admissionNumber: get('Admission Number'),
    patientCode: get('HI|Patient Code'),
    diagnosis: get('Diagnosis'),
  };
};

const parseLogs = (text) => {
  const lines = text.split('\n');
  const logs = [];
  for (let line of lines) {
    const m = line.match(/^(\d{2}:\d{2})\s+(.*)/);
    if (m) {
      logs.push({
        logTime: m[1],
        subjective: m[2],
        objective: '',
        assessment: '',
        plan: '',
        instruction: '',
      });
    }
  }
  return logs;
};

module.exports = { convertPdfToImage, parseForm, parseLogs };
