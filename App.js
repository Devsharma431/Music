const FULL_PLAYLIST = "UUlYV6hHlupm_S_ObS1W-DYw";

const tracks = [
  {
    id: "starboy",
    title: "Starboy",
    meta: "The Weeknd • Starboy • 2016",
    yt: "34Na4j8AVgA"
  },
  {
    id: "blinding",
    title: "Blinding Lights",
    meta: "The Weeknd • After Hours • 2020",
    yt: "fHI8X4OXluQ"
  },
  {
    id: "callout",
    title: "Call Out My Name",
    meta: "The Weeknd • My Dear Melancholy, • 2018",
    yt: "M4ZoCHID9GI"
  },
  {
    id: "hills",
    title: "The Hills",
    meta: "The Weeknd • Beauty Behind the Madness • 2015",
    yt: "yzTuBuRdAyA"
  },
  {
    id: "save",
    title: "Save Your Tears",
    meta: "The Weeknd • After Hours • 2020",
    yt: "XXYlFuWEuKI"
  },
  {
    id: "cantfeel",
    title: "Can't Feel My Face",
    meta: "The Weeknd • Beauty Behind the Madness • 2015",
    yt: "KEI4qSrkPAs"
  },
  {
    id: "howdo",
    title: "How Do I Make You Love Me?",
    meta: "The Weeknd • Dawn FM • 2022",
    yt: "VLMo0rthnoo"
  },
  {
    id: "afterhours",
    title: "After Hours",
    meta: "The Weeknd • After Hours • 2020",
    yt: "ygTZZpVkmKg"
  }
];

const grid = document.querySelector("#trackGrid");
const title = document.querySelector("#nowTitle");
const meta = document.querySelector("#nowMeta");
const open = document.querySelector("#ytOpen");
const libraryBtn = document.querySelector("#fullLibrary");

let player = null;
let currentId = "34Na4j8AVgA";


// ─────────────────────────────────────────────
// CREATE SONG LIST
// ─────────────────────────────────────────────

grid.innerHTML = tracks
  .map(
    (track, index) => `
      <button
        class="track"
        data-id="${track.id}"
        aria-label="Play ${track.title}"
      >
        <span class="track-num">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <span>
          <span class="track-title">
            ${track.title}
          </span>

          <span class="track-meta">
            ${track.meta}
          </span>
        </span>

        <span class="track-play">
          ▶
        </span>
      </button>
    `
  )
  .join("");


// ─────────────────────────────────────────────
// UPDATE NOW PLAYING
// ─────────────────────────────────────────────

function updateNowPlaying(track) {
  if (!track) return;

  title.textContent = track.title;

  meta.textContent = track.meta;

  open.href =
    `https://www.youtube.com/watch?v=${track.yt}`;

  currentId = track.yt;
}


// ─────────────────────────────────────────────
// PLAY INDIVIDUAL TRACK
// ─────────────────────────────────────────────

function playTrack(track) {
  if (!track) return;

  updateNowPlaying(track);

  if (
    player &&
    typeof player.loadVideoById === "function"
  ) {
    player.loadVideoById({
      videoId: track.yt
    });
  }

  document
    .querySelector("#listen")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


// ─────────────────────────────────────────────
// PLAY FULL YOUTUBE LIBRARY
// ─────────────────────────────────────────────

function loadFullLibrary() {
  if (
    player &&
    typeof player.loadPlaylist === "function"
  ) {
    player.loadPlaylist({
      list: FULL_PLAYLIST,
      listType: "playlist",
      index: 0
    });

    title.textContent =
      "The Weeknd — Full YouTube Library";

    meta.textContent =
      "YouTube Topic uploads • playlist mode";

    open.href =
      `https://www.youtube.com/playlist?list=${FULL_PLAYLIST}`;
  }
}


// ─────────────────────────────────────────────
// YOUTUBE IFRAME API
// ─────────────────────────────────────────────

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("ytPlayer", {
    width: "100%",
    height: "100%",

    videoId: "34Na4j8AVgA",

    playerVars: {
      playsinline: 1,
      rel: 0,
      enablejsapi: 1,
      origin: window.location.origin
    },

    events: {

      // Player loaded
      onReady: function () {
        updateNowPlaying(tracks[0]);
      },


      // Player state changed
      onStateChange: function (event) {

        /*
          When the full YouTube playlist is loaded,
          YouTube handles:

          - Next
          - Previous
          - Continuous playback
          - Playlist navigation

          automatically.
        */

        if (
          event.data === YT.PlayerState.PLAYING
        ) {
          console.log("Playing");
        }

        if (
          event.data === YT.PlayerState.PAUSED
        ) {
          console.log("Paused");
        }

        if (
          event.data === YT.PlayerState.ENDED
        ) {
          console.log("Song ended");
        }
      },


      // YouTube error
      onError: function (event) {

        console.log(
          "YouTube player error:",
          event.data
        );

        meta.textContent =
          "This YouTube video cannot be embedded here. " +
          "Use the full library button or open it on YouTube.";
      }

    }
  });
};


// ─────────────────────────────────────────────
// SONG LIST CLICK
// ─────────────────────────────────────────────

grid.addEventListener("click", function (event) {

  const row =
    event.target.closest(".track");

  if (!row) return;

  const track =
    tracks.find(
      item => item.id === row.dataset.id
    );

  if (track) {
    playTrack(track);
  }
});


// ─────────────────────────────────────────────
// FULL LIBRARY BUTTON
// ─────────────────────────────────────────────

libraryBtn.addEventListener(
  "click",
  function () {
    loadFullLibrary();
  }
);
