import { AudiopcpPage } from './app.po';

describe('audiopcp App', function() {
  let page: AudiopcpPage;

  beforeEach(() => {
    page = new AudiopcpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
