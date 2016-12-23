import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, EventEmitter, AfterViewInit, Renderer } from '@angular/core';
import { StateManagerService } from './state-manager.service';
import { ITrial, IAudio, ICategory, IOption, IPlaybackOptions, ITickEventData } from './types';

const numberOfTimes = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app works!';
  loading: boolean = true;
  completed: boolean = false;
  progressPercent: number = 0;
  trialNumber: number = 0;
  totalTrials: number = 0;

  mode: number;
  // audios: IAudio[];
  options: IOption[] = null;
  categories: ICategory[];
  currentCategory: ICategory;
  audioSrc: string;
  audioPlaybackStack: IPlaybackOptions[] = [];

  currentCategoryIndex: number = 0;

  countUpTimer: Timer;
  countDownTimer: Timer;

  trialStartTimeStamp = Date.now();



  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChildren('optionRef') optionRefs: QueryList<ElementRef>;



  constructor(private sm: StateManagerService, private renderer: Renderer) {
    // Configure and Init the Count Up Timer
    this.countUpTimer = new Timer({
      type: 'countUp',
      startVal: 0,
      tickInterval: 10, // ms
    });
    this.countUpTimer.tickEvent.subscribe((tickEventData: ITickEventData) => {
      // console.log('Count Up Timer', tickEventData);
    });

    // Configure and Init the Count Down Timer
    this.countDownTimer = new Timer({
      type: 'countDown',
      startVal: 3,
      tickInterval: 1000 // ms
    });
    this.countDownTimer.tickEvent.subscribe((tickEventData: ITickEventData) => {
      // console.log('Count Down Timer', tickEventData);
      if (tickEventData.completed) {
        this.playSounds();
      }
    });
  }
  ngOnInit() {


  }
  ngAfterViewInit() {
    this.mode = this.sm.getMode();
    this.sm.getCategories().subscribe((categories: ICategory[]) => {
      this.categories = categories;
      this.totalTrials = numberOfTimes * this.categories.length;
      this.options = this.getOptionsFromCategories(this.categories);
      this.cacheAudioFiles();


      this.optionRefs.changes.subscribe(() => {
        this.positionFromCenter(this.optionRefs);
      });

    });
    // let arr = this.optionRefs.values();
  }
  getOptionsFromCategories(categories): IOption[] {
    let options: IOption[] = [];
    categories.forEach((category, index) => {
      // console.log(category);

      let option: IOption = {
        imageSrc: category.imgSrc,
        status: 'untouched',
      };
      options.push(option);
    });
    return options;
  }

  resetOptions() {
    this.options.forEach(option => {
      option.reactionTime = null;
      option.status = 'untouched';
    });
  }

  play(playbackOptions: IPlaybackOptions) {
    // Set the audioSrc
    this.audioPlayer.nativeElement.src = playbackOptions.audioSrc;

    setTimeout(() => {
      // Set mute status
      this.audioPlayer.nativeElement.muted = playbackOptions.isMuted;
      // Play the audio file
      this.audioPlayer.nativeElement.play();
    }, {}, 0);


  }

  getAudioSrc(type: number) {
    return this.categories[type].sounds[this.mode];
  }
  getRandomNumber(): number {
    return Math.floor(Math.random() * this.categories.length);
  }

  playSounds() {


    if (this.categories[this.currentCategoryIndex].useCount < numberOfTimes) {
      let audioSrc = this.categories[this.currentCategoryIndex].sounds[this.mode];

      console.log(this.currentCategoryIndex + ':' + audioSrc);

      this.play({
        audioSrc: audioSrc,
        isMuted: false
      });

      this.startReactionTimer();
    }
  }

  cacheAudioFiles() {
    this.progressPercent = 0;
    this.categories.forEach(category => {
      let numberOfSounds = category.sounds.length;
      category.sounds.forEach((sound, index) => {
        this.play({ isMuted: true, audioSrc: sound });
        this.progressPercent = ((index + 1) * 100) / numberOfSounds;
      });
    });
  }
  updateProgress(percent: number) {
    this.progressPercent = percent;
  }

  nextTrial() {
    this.resetOptions();
    this.startCountdown();
    this.currentCategoryIndex = this.getRandomNumber();
  }

  onOptionClick(index: number) {
    if (this.countUpTimer) {
      if (index === this.currentCategoryIndex) {
        this.stopReactionTimer();
        let trial: ITrial = {
          timestamp: this.trialStartTimeStamp,
          mode: this.mode,
          trialNo: this.trialNumber,
          reactionTime: this.countUpTimer.counter * 10
        };
        this.saveTrial(trial);
        this.trialNumber++;
        if (this.trialNumber === this.totalTrials) {
          this.finishTrial();
        }
        // Increase use count of category
        this.categories[this.currentCategoryIndex].useCount++;
        this.options[index].reactionTime = this.countUpTimer.counter * 10;
        this.options[index].status = 'correct';
        this.countUpTimer.reset();
      } else {
        this.options[index].status = 'wrong';
      }
    }
  }
  saveTrial(trial: ITrial) {
    this.sm.saveTrial(trial);
  }
  finishTrial() {
    console.log('finishTrial');
    // this.observations.forEach(observation => {
    //   this.sm.saveObservation(observation);
    // });
  }

  stopCountdown() {
    if (this.countDownTimer) {
      this.countDownTimer.stop();
    }
  }
  startCountdown() {
    if (this.countDownTimer) {
      this.countDownTimer.reset();
    }
    this.countDownTimer.start();
  }
  startReactionTimer() {
    if (this.countUpTimer) {
      this.countUpTimer.reset();
    }
    this.countUpTimer.start();
  }
  stopReactionTimer() {
    if (this.countUpTimer) {
      this.countUpTimer.stop();
    }
  }

  positionFromCenter(optionRefs: QueryList<ElementRef>) {
    console.log('Position On Circle');
    let angle = 0;
    let step = 360 / optionRefs.length; // 360 degrees
    let radius = 12; // circle radius

    optionRefs.forEach((optionRef, index) => {

      let option = optionRef.nativeElement;

      let radX = radius * Math.cos(angle + (step * index));
      let radY = radius * Math.sin(angle + step * index);

      let optionAngle = angle + (step * index);

      this.renderer.setElementStyle(option, 'transform', `
      rotate(${optionAngle}deg) 
      translate(${radius}em) 
      rotate(-${optionAngle}deg)
      `);
    });

  }

  centerElement(elementRef: ElementRef) {
    elementRef.nativeElement.style.position = 'absolute';
    // this.css("position", "absolute");
    // this.css("top", Math.max(0, (($(window).height() -$(this).outerHeight()) / 2) ) + "px");
    // this.css("left", Math.max(0, (($(window).width() -$(this).outerWidth())) / 2) + "px");
    //

    elementRef.nativeElement.style.top =
      Math.max(0, (window.innerHeight - elementRef.nativeElement.outerHeight / 2) + window.scrollY) + 'px';
    elementRef.nativeElement.style.left =
      Math.max(0, ((window.innerWidth - elementRef.nativeElement.outerWidth) / 2) + window.scrollX) + + 'px';

    return this;
  }
  getTrialStatus(): number {
    let totalCount = 0;
    this.categories.forEach(category => {
      if (category.useCount < numberOfTimes) {
        totalCount++;
      }
    });
    return totalCount;
  }

}

export interface TimerConfig {
  type?: 'countDown' | 'countUp';
  tickInterval?: number;
  startVal?: number;
}


export class Timer {

  type: string;
  tickEvent: EventEmitter<ITickEventData>;
  timer: any;
  counting: boolean = false;
  counter: number = 0;

  startVal: number;
  tickInterval: number = 10;

  constructor(config?: TimerConfig) {

    if (config.type) {
      this.type = config.type;
    }
    if (config.tickInterval) {
      this.tickInterval = config.tickInterval;
    }
    if (config.startVal) {
      this.startVal = config.startVal;
    } else {
      this.startVal = 0;
    }
    this.tickEvent = new EventEmitter();
  }
  tick() {
    if (this.type === 'countDown') {
      this.counter--;
      if (this.counter <= 0) {
        this.stop();
        this.tickEvent.emit({ counter: this.counter, completed: true });
      } else {
        this.tickEvent.emit({ counter: this.counter, completed: false });
      }
    } else if (this.type === 'countUp') {
      this.counter++;
      this.tickEvent.emit({ counter: this.counter, completed: false });
    }
  }

  start() {
    this.reset();
    this.stop();
    this.counter = this.startVal;
    this.counting = true;
    this.timer = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }
  reset() {
    this.counting = false;
    this.counter = this.startVal;
  }
  stop() {
    this.counting = false;
    clearInterval(this.timer);
  }

}
