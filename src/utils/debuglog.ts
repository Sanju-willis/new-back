// src\utils\debuglog.ts

const DEBUG_FLOW = process.env.DEBUG_FLOW;
const DEBUG_DATA = process.env.DEBUG_DATA;

export function flowLog(...args: any[]) {
     if (DEBUG_FLOW) console.log('🔁 [FLOW]', ...args); 
}
export function dataLog(...args: any[]) {
  if (DEBUG_DATA) console.log('📦 [DATA]', ...args);
}