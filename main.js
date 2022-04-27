const $ = document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat') ;
const playList = $('.playlist');
const PLAYER_STORAGE_KEY = 'P_PLAYER';


console.log(progress);

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: {},
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Chạy về khóc với anh",
          singer: "Erik",
          path: "./music/chay ve khoc voi anh.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "Thương em đến già",
          singer: "LÊ BẢO BÌNH",
          path: "./music/thuong den khi gia.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Muộn rồi mà sao còn",
          singer: "Sơn Tùng MTP",
          path: "./music/muon roi ma sao con.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Đom đóm",
          singer: "Jack",
          path: "./music/dom dom.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Chờ ngày cưới em",
          singer: "Ft. HƯƠNG LY",
          path: "./music/cho ngay cuoi em.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "See Tình",
          singer: "Hoàng Thùy Linh",
          path: "./music/see tinh.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Người âm phủ",
          singer: "Osad",
          path: "./music/nguoi am phu.mp3",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "GhostDragon & dreamr",
            singer: "ft. Ashley Alisha",
            path: "./music/GhostDragon & dreamr. - could've been us (Lyrics) ft. Ashley Alisha.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //  Xử lý CD quay / dừng
        const cdThumbAnimate =  cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,    // 10 seconds
            iterations: Infinity
        });

        cdThumbAnimate.pause();
        //  Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop =  window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
            cd.style.opacity = newCDWidth / cdWidth;
        };

        //  Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        };
        
        //  Khi song được player 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        //  Khi song bị player 
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        };

        //  Khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        //  Xử lý bật / tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.playRandomSong();
        };

        //  Xử lý lặp lại một song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        //  Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        //  Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')) {
                //  Xử lý khi click vào song
                if(songNode) {
                    // console.log(songNode.getAttribute('data-index'));
                    // console.log(songNode.dataset.index);
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //  Xử lý khi click vào song option
                if(e.target.closest('.option')) {

                }
            }
        };
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollInToView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        // console.log(this.currentIndex);
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    preSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;

        this.loadCurrentSong();
    },
    start: function() {
        //  Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        //  Định nghĩa các thuộc tính cho OBJECT
        this.defineProperties();

        //  Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        //  Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();


        //  Render playlist
        this.render();

        //  Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();