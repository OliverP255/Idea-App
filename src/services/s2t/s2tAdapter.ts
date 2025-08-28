export type InterimCallback = (text: string) => void;
export type FinalCallback = (text: string) => void;


let _interval: any;
let _progress = 0;


export function startMockSession({ onInterim, onFinal }: { onInterim: InterimCallback; onFinal: FinalCallback; }) {
_progress = 0;
const transcripts = [
'I am thinking about a new app that',
'I am thinking about a new app that helps creators capture',
'I am thinking about a new app that helps creators capture ideas instantly and',
'I am thinking about a new app that helps creators capture ideas instantly and organize them into notes with actions'
];


_interval = setInterval(() => {
if (_progress < transcripts.length) {
onInterim(transcripts[_progress]);
_progress++;
} else {
clearInterval(_interval);
onFinal(transcripts[transcripts.length - 1]);
}
}, 900);


return {
stop: () => {
if (_interval) clearInterval(_interval);
onFinal(transcripts[Math.min(_progress - 1, transcripts.length - 1)]);
}
};
}