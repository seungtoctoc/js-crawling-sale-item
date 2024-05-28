import schedule from 'node-schedule';
import { exec } from 'child_process';

const executeNike = () => {
  exec('node crawling/nike.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`실행 중 오류 발생: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

schedule.scheduleJob('0 7 * * *', () => {
  console.log('start executeNike');
  executeNike();
  console.log('executeNike complete');
});
