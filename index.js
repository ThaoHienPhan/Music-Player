 // 1 Render songs
      // 2 ScrollTop
      // 3 Play/pause/Seek
      // 4 CD rotate
      // 5 Next/prev song
      // 6 Random
      // 7 Next/ repeat when ended
      // 8 Active song
      // 9 Scroll active song into view
      //10 Play song when click

      const $ = document.querySelector.bind(document)
      const $$ = document.querySelectorAll.bind(document)
      const PLAYER_STORAGE_KEY = 'HIEN_PLAYER'

      const heading = $('header h2')
      const cdThumb = $('.cd-thumb')
      const audio = $('#audio')
      const playBtn = $('.btn-toggle-play')
      const player = $('.player')
      const progress = $('.progress')
      const cd = $('.cd')
      const nextBtn = $('.btn-next')
      const prevBtn = $('.btn-prev')
      const randomBtn = $('.btn-random')
      const repeatBtn = $('.btn-repeat')
      const playlist = $('.playlist')
      const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
          {
            name: '10000 Hours',
            singer: 'Justin',
            path: './mp3/10000Hours.mp3',
            image: './img/10000.PNG'
          },
          {
            name: 'Everything i need',
            singer: 'ABC',
            path: './mp3/Everything i need.mp3',
            image: './img/EVRTIN.PNG'
          },
          {
            name: 'Home',
            singer: 'EGF',
            path: './mp3/Home.mp3',
            image: './img/Home.PNG'
          },
          {
            name: 'Let her go',
            singer: 'HHH',
            path: './mp3/Let her go.mp3',
            image: './img/Lethergo.PNG'
          },
          {
            name: 'Beautiful In White',
            singer: 'Shane Filan',
            path: './mp3/Beautiful In White Official Video.mp3',
            image: './img/BTFIW.PNG'
          },
          {
            name: 'At My Worst',
            singer: 'Haha',
            path: './mp3/At My Worst Official Video.mp3',
            image: './img/AMW.PNG'
          },
          {
            name: 'Never Enough',
            singer: 'The Greatest Showman',
            path: './mp3/Never Enough.mp3',
            image: './img/never.PNG'
          },
          {
            name: 'Dust Till Dawn',
            singer: 'ZAYN',
            path: './mp3/Dusk Till Dawn.mp3',
            image: './img/DTD.PNG'
          },
        ],
        setConfig: function (key, value) {
          this.config[key] = value;
          localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
        },
        render: function () {
          const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class = "title">${song.name} </h3>
                            <p class = 'author'>${song.singer} </p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    `
          })
          playlist.innerHTML = htmls.join('');

        },
        defineProperties: function () {
          Object.defineProperty(this, 'currentSong', {
            get: function () {
              return this.songs[this.currentIndex]
            }
          })
        },
        handleEvents: function () {
          const _this = this
          const cdWidth = cd.offsetWidth

          //X??? l?? CD quay/ d???ng
          const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
          ], {
            duration: 10000, //10s
            iterations: Infinity
          })
          cdThumbAnimate.pause()

          //X??? l?? ph??ng to thu nh??? cd
          document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop
            // console.log(newcdWidth)

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
          }

          //X??? l?? khi click play
          playBtn.onclick = function () {
            if (_this.isPlaying) {
              audio.pause();
            }
            else {
              audio.play();
            }

          }

          // Khi song dc play
          audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            // console.log (cdThumbAnimate);
            cdThumbAnimate.play();
          }

          // Khi song bi pause
          audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
          }

          //Khi ti???n ????? b??i h??t thay ?????i
          audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
              progress.value = progressPercent
            }
          }

          // x??? l?? khi tua song
          progress.onchange = function (e) {
            // e.target: input#progress.progress
            // e.target.value l?? ph???n tr??m b??i h??t khi tua
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
          }

          //Khi next song
          nextBtn.onclick = function () {
            if (_this.isRandom) {
              _this.playRandomSong();
            } else {
              _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
          }

          //Khi prev song
          prevBtn.onclick = function () {
            if (_this.isRandom) {
              _this.playRandomSong();
            } else {
              _this.prevSong();
            }
            audio.play();
            // _this.scrollToActiveSong();

          }

          //X??? l?? random b???t / t???t random song
          randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom);
          }

          //X??? l?? ph??t l???i 1 song
          repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle("active", _this.isRepeat);
          }

          //x??? l?? next song khi audio ended
          audio.onended = function () {
            if (_this.isRepeat) {
              audio.play();
            } else {
              nextBtn.click();
            }
          }
          //l???ng nghe h??nh vi click v??o playlist
          playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active')
            if (songNode || e.target.closest('.option')) {
              // x??? l?? khi click v??o song 
              if (songNode) {
                // console.log(songNode)
                // console.log(songNode.getAttribute('data-index'))
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()

              }

            }
          }

        },
        scrollToActiveSong: function () {
          setTimeout(() => {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }, 300)
        },
        loadCurrentSong: function () {
          heading.textContent = this.currentSong.name
          cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
          audio.src = this.currentSong.path
        },

        loadConfig: function () {
          this.isRandom = this.config.isRandom
          this.isRepeat = this.config.isRepeat
        },

        nextSong: function () {
          this.currentIndex++
          // console.log(this.currentIndex,this.songs.length)

          if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
          }
          this.loadCurrentSong()
        },

        prevSong: function () {
          this.currentIndex--
          console.log(this.currentIndex, this.songs.length)

          if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
          }
          this.loadCurrentSong()
        },

        playRandomSong: function () {
          let newIndex
          do {
            newIndex = Math.floor(Math.random() * this.songs.length);
          }
          while (newIndex === this.currentIndex)
          this.currentIndex = newIndex;
          this.loadCurrentSong();
        },
        start: function () {
          //G??n c???u h??nh t??? config v??o ???ng d???ng
          this.loadConfig();

          //?????nh ngh??a c??c thu???c t??nh cho object              
          this.defineProperties()

          //L???ng nghe / x??? l?? c??c s??? ki???n (DOM event)
          this.handleEvents();

          //T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
          this.loadCurrentSong();

          //Render playlist
          this.render();
          randomBtn.classList.toggle('active', this.isRandom)
          repeatBtn.classList.toggle('active', this.isRepeat)
        }
      }

      app.start()
