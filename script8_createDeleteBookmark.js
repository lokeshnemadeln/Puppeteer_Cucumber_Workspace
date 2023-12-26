import puppeteer from 'puppeteer';
import assert from 'assert'

 class script8_createDeleteBookmark {
  
    script8_createDeleteBookmark() {
    this.browser = null;
    this.nameToBeInput = null;
  }

  async logOnConsole(message){
    console.log(message);
  } 

  async launchBrowser() {
    this.browser = await puppeteer.launch({headless: false,
        defaultViewport: null,
        args: ['--start-maximized'] 

    });
  }
 
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
 
  async createPage() {
    if (this.browser) {
      const page = await this.browser.newPage();
      
      await page.setViewport({
        width: 1280,
        height: 500 ,
        deviceScaleFactor: 1,
      });
      return page;
    }
    throw new Error('Browser not launched');
  }

  async navigateToBox(page){
    await page.goto('https://app.box.com', {timeout: 0, waitUntil: 'networkidle0'});
  }
 
  async closePage(page) {
    if (page) {
      await page.close();
    }
  }
  async loginPage(page)
  {
    if(page)
    {
        // await page.goto('https://app.box.com');
       
        const inputSelector = 'input[id="login-email"]';
        await page.type(inputSelector,"qacult.demo@gmail.com");
        // const el = await page.$x('//button[contains(text(),\'Next\')]');
        // console.log(el);
        // await el.click();
        // await el.dispose();
        await page.click('#login-submit');
        await this.sleep(2000);
        await page.type('#password-login',"testing123");
        
        // await this.sleep(12000);
    }
  }

  async loginWithWrongCredentials(page){
    const inputSelector = 'input[id="login-email"]';
    await page.type(inputSelector,"abcdef@gmail.com");
  
    await page.click('#login-submit');
    await this.sleep(2000);
    await page.type('#password-login',"qwertyuiop");
  }

    async clickLoginSubmit(page){
      await page.click('#login-submit-password');

    }

    // use of function sleep
    async sleep(milliseconds) {  
        return new Promise(resolve => setTimeout(resolve, milliseconds));  
     }  

     async openNewBookmarkPopup(page){
        await page.waitForSelector('button.create-dropdown-menu-toggle-button:not([aria-disabled])');
        await page.click('button.create-dropdown-menu-toggle-button:not([aria-disabled])');
        await page.click('li[aria-label=\'Create a new Bookmark\']',{clickCount: 1});
        let selector = "div.modal-header";
        await page.waitForSelector(selector);
        // await this.sleep(selector);
        const heading = await page.$eval('div.modal-header',(element=>element.textContent));
        console.log(heading);
        await this.sleep(2000);
        assert.strictEqual(heading, 'Create New Bookmark', 'Assertion failed: Element content does not match expected value');
        console.log('Assertion Passed');
        // expect(heading).toEqual('Create a New Folder');
     }

     async createBookmark(page){
      this.nameToBeInput = "new"+ Math.floor(Math.random() * 1000);
      await page.type('input[data-resin-target=\'urlinput\']',this.nameToBeInput);
      await page.click('button.btn-primary',{clickCount: 1});
      await this.sleep(5000);
     }

     async verifyNotification(page){
      await page.waitForSelector('div[class*=\'notification info wrap\']');
      const successMessageText = "A bookmark for \""+this.nameToBeInput+"\" was created successfully.";
      console.log(successMessageText);
      await this.sleep(800);
      const heading = await page.$eval('div[class*=\'notification info wrap\']',(element=>element.textContent));
      assert.strictEqual(heading, successMessageText, 'Assertion failed: Element content does not match expected value');
      console.log('Assertion Passed');
      await page.click('button.close-btn',{clickCount: 1});
      await this.sleep(3000);
     }

     async deleteBookmark(page){
      await page.waitForSelector('div[role=\'row\'][tabindex=\'0\']:nth-child(1)');
      await page.hover('div[role=\'row\'][tabindex=\'0\']:nth-child(1)');
      await page.click('input[id*=\'checkbox\']',{clickCount: 1});
      await page.click('button[aria-label=\'Trash\']');
      await page.waitForSelector('button[data-resin-target=\'primarybutton\']');
      await page.click('button[data-resin-target=\'primarybutton\']');
     }

     async verifyDeleteNotification(page){
      await page.waitForSelector('div[class*=\'notification info wrap\']');
      const deleteMessageText = "Item successfully moved to trash.";
      // console.log(successMessageText);
      await this.sleep(800);
      const heading = await page.$eval('div[class*=\'notification info wrap\']',(element=>element.textContent));
      assert.notStrictEqual(heading, deleteMessageText, 'Assertion failed: Element content does not match expected value');
      console.log('Assertion Passed');
      await page.click('button.close-btn',{clickCount: 1});
      
     }

     async clickAccountBtn(page){
      await page.waitForSelector('button[data-resin-target=\'accountmenu\']');
      await page.click('button[data-resin-target=\'accountmenu\']',{clickCount: 1});
     }

     async logout(page){
      
      await page.waitForSelector('a[data-testid=\'account-menu-logout\']');
      await page.click('a[data-testid=\'account-menu-logout\']',{clickCount: 1});
      await this.sleep(3000);
     }

     async displayError(page){
      await page.waitForSelector('div.form-error');
     }
}
 
export default script8_createDeleteBookmark;
