// Prints the weekend the routine should research, plus a Vienna timestamp:
//   {"saturday":"2026-10-03","sunday":"2026-10-04","updated":"Fri 2 Oct, 07:00"}
import { upcomingWeekend, viennaStamp } from './weekend.mjs';

console.log(JSON.stringify({ ...upcomingWeekend(), updated: viennaStamp() }));
