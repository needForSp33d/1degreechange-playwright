const { test, expect } = require('@playwright/test');

test.describe('Acceptance Criteria Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://bibinabraham88.github.io/1degreeshift/');
  });

  test('Verify the page was loaded successfully', async ({ page }) => {
    await expect(page).toHaveURL('https://bibinabraham88.github.io/1degreeshift/');
    const element = await page.$('#home > h2');
    const isVisible = await element.isVisible();
    expect(isVisible).toBe(true); 
    const headerText = await page.textContent('#home > h2');
    expect(headerText).toContain('Engineering Excellence, One Degree at a Time');
  });

  test('Click the button that says “Start Search”', async ({ page }) => {
    await page.click('#home > a');
    const header = await page.$('#search > h2');
    const isVisible = await header.isVisible();
    expect(isVisible).toBe(true); 
  });


  test('Select from the dropdowns and click “Search”', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
  });

  test.only('Ensure that 3 results are displayed, and pricing is in US dollars', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
    const results = await page.$$('#results > div:nth-child(n)');
    const resultsLgnth = (results.length);
    await expect(resultsLgnth).toEqual(3);
    for (let result of results) {
      const price = await result.$$eval('#results > div:nth-child(n) > p:nth-child(3) [n].innerText', el => el.textContent);
      console.log(result);
      expect(price).toMatch(/\$\d+/); // Ensure pricing is in US dollars
    }
  });



  test('Click on “Select” on the second result', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
    const secondResult = (await page.$$('.select-btn'))[1];
    await secondResult.click();
  });

  test('Complete and submit the form with realistic customer data and ensure it is submitted', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
    const secondResult = (await page.$$('.select-btn'))[1];
    await secondResult.click();
    await page.fill('#name', 'John Doe');
    await page.fill('#postcode', 'A5 6BC');
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'john.doe@example.com');
    await page.click('text=Submit');
    await expect(page).toHaveText('Submission Successful'); // Replace with the actual success message
  });

  test('Trigger and then correct one validation rule for a field', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
    const secondResult = (await page.$$('.select-btn'))[1];
    await secondResult.click();
    await page.fill('#phone', 'invalidphone'); // Trigger validation
    await page.click('text=Submit');
    await expect(page.locator('#phone-error')).toHaveText('Phone number should only contain numbers'); // Replace with actual error message

    await page.fill('#phone', '1234567890'); // Correct the validation
    await page.click('text=Submit');
    await expect(page).toHaveText('Submission Successful'); // Replace with the actual success message
  });

  test('Validate mandatory fields, postcode format, phone number, and email address format', async ({ page }) => {
    await page.click('#home > a');
    await page.selectOption('#service','Performance Testing'); // Replace 'New Service' with actual option value
    await page.selectOption('#type', 'Automation Testing');       // Replace 'New Type' with actual option value
    await page.selectOption('#duration','6 months+'); // Replace 'New Duration' with actual option value
    await page.click('#searchButton');
    const secondResult = (await page.$$('.select-btn'))[1];
    await secondResult.click();
    await page.fill('#name', '');
    await page.click('text=Submit');
    await expect(page.locator('#name-error')).toHaveText('* marked fields are mandatory'); // Replace with actual error message

    await page.fill('#name', 'John Doe');
    await page.fill('#postcode', 'Invalid');
    await page.click('text=Submit');
    await expect(page.locator('#postcode-error')).toHaveText('Postcode should be in A5 6BC or A56 7BC format');

    await page.fill('#postcode', 'A5 6BC');
    await page.fill('#phone', 'Invalid');
    await page.click('text=Submit');
    await expect(page.locator('#phone-error')).toHaveText('Phone number should only contain numbers');

    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'invalidemail');
    await page.click('text=Submit');
    await expect(page.locator('#email-error')).toHaveText('Email address should be “a@b.com” format');

    await page.fill('#email', 'john.doe@example.com');
    await page.click('text=Submit');
    await expect(page).toHaveText('Submission Successful'); // Replace with the actual success message
  });

});