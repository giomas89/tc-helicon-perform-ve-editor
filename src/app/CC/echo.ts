import { Output } from 'webmidi';

export function toggleEcho(midiOutput: Output | undefined, currentState: boolean, selectedChannel: number): boolean {
  if (midiOutput) {
    const value = currentState ? 0 : 64; // 0 per OFF, 64 per ON
    midiOutput.sendControlChange(55, value, { channels: selectedChannel });
    console.log(`ECHO ${currentState ? 'OFF' : 'ON'} sent`);
  } else {
    console.log('No MIDI output available. Cannot send CC message.');
  }
  return !currentState; // Restituisce il nuovo stato
}