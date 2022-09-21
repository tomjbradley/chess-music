import "./style.css";

import { Chess } from "chess.js";
import * as Tone from "tone";
import _ from "lodash";

document.querySelector("#app").innerHTML = `
  <button id="playButton">Play</button>
  <div id="board1" style="width: 400px"></div>
`;

// Get Moves
var board1 = Chessboard("board1", "start");

const chess = new Chess();
const pgn = [
  '[Event "Match"]',
  '[Site "Sveti-Stefan/Belgrade (Yugoslavia)"]',
  '[Date "1992.??.??"]',
  '[Round "?"]',
  '[White "Bobby Fischer"]',
  '[Black "Boris V Spassky"]',
  '[Result "1-0"]',
  "",
  "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3",
  "O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15.",
  "Bg5 h6 16. Bd2 Bg7 17. a4 c5 18. d5 c4 19. b4 Nh7 20. Be3 h5 21. Qd2 Rf8 22. Ra3",
  "Ndf6 23. Rea1 Qd7 24. R1a2 Rfc8 25. Qc1 Bf8 26. Qa1 Qe8 27. Nf1 Be7 28. N1d2 Kg7",
  "29. Nb1 Nxe4 30. Bxe4 f5 31. Bc2 Bxd5 32. axb5 axb5 33. Ra7 Kf6 34. Nbd2 Rxa7",
  "35. Rxa7 Ra8 36. g4 hxg4 37. hxg4 Rxa7 38. Qxa7 f4 39. Bxf4 exf4 40. Nh4 Bf7 41.",
  "Qd4+ Ke6 42. Nf5 Bf8 43. Qxf4 Kd7 44. Nd4 Qe1+ 45. Kg2 Bd5+ 46. Be4 Bxe4+ 47.",
  "Nxe4 Be7 48. Nxb5 Nf8 49. Nbxd6 Ne6 50. Qe5 1-0",
];

chess.loadPgn(pgn.join("\n"));

const moves = chess.history({ verbose: true });

const playButton = document.getElementById("playButton");
const synth = new Tone.Synth().toDestination();

const game = new Chess();

let isPlaying = false;
let interval;

playButton.addEventListener("click", () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    Tone.start();
    playButton.textContent = "Pause";

    // Loop Through Moves
    let index = 0;

    interval = setInterval(() => {
      const move = moves[index];
      const note = convertCoordinatePairToIPN(move.to);

      let now = Tone.now();
      synth.triggerAttack(note, now);
      synth.triggerRelease(now + 1);

      game.move(move.san);
      let position = game.fen();
      board1.position(position);

      if (index < moves.length - 1) {
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  } else {
    playButton.textContent = "Play";
    clearInterval(interval);
  }
});

const convertCoordinatePairToIPN = (coordinate) => {
  const scale = ["C", "D", "E", "F", "G", "A", "B", "C"];

  let file = coordinate[0];
  let rank = coordinate[1];

  let note = scale[file.charCodeAt() - 97];

  if ((file = "h")) rank++;

  return note + rank;
};
