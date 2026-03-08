import React from 'react';

const Cookies = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>

      <section className="mb-6">
        <p className="mb-2">
          Cookies, clear gifs, and similar technologies (collectively referred to as “cookies”) are used on our sites to personalize content and ads, enhance product features, and analyze traffic on our sites by EditWithSanjay.in, our business partners, and authors. As part of our commitment to transparency with our users, we’ve created this guide to explain the tracking technologies used on our sites.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">What are cookies, clear gifs, and similar technologies?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Cookies are small data files sent to your web browser or mobile device and stored in your browser cache.
          </li>
          <li>
            Clear gifs and pixel trackers are tiny graphics with unique identifiers, similar in function to cookies. They track user movements between pages and websites. These are embedded invisibly on web pages, typically about the size of a single pixel.
          </li>
          <li>
            First-party cookies are set by us when you visit one of our sites, while third-party cookies are set by entities other than the website you’re visiting.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Cookies and similar technologies used on EditWithSanjay.in</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Strictly Necessary:</strong> These cookies are essential for basic website functions like navigation, security, and accessing authenticated areas.
          </li>
          <li>
            <strong>Preferences:</strong> These cookies store information that changes the website’s behavior or appearance, such as your region settings.
          </li>
          <li>
            <strong>Statistics:</strong> These cookies help us understand visitor interactions by collecting and reporting data.
          </li>
          <li>
            <strong>Marketing:</strong> These cookies track browsing activity and allow us to display relevant, customized ads.
          </li>
          <li>
            <strong>Third Parties:</strong> Our business partners and authors may use cookies for the purposes described above.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">How to manage your preferences and settings</h2>
        <p className="mb-2">
          Please note that altering standard settings may affect your browsing experience.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Visitors in the European Union can manage their preferences through the preferences panel. Preferences can be updated by clearing cookies, refreshing the page, and reselecting preferences.
          </li>
          <li>
            Users can also learn how to opt out of third-party cookies or change browser settings by consulting the following guides:
            <ul className="list-disc list-inside pl-6 space-y-2">
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Firefox</a>
              </li>
              <li>
                <a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Chrome</a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/105082" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Safari</a>
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact, questions, and updates</h2>
        <p className="mb-2">
          We may update this Cookie Policy from time to time and will take reasonable steps to inform our users of these changes. You can track updates by referring to the date below.
        </p>
        <p className="mb-2">
          If you have any questions about our privacy practices or need assistance in managing your cookie preferences, please contact us at <a href="/contact-us" className="text-blue-500 underline">Contact Us</a>.
        </p>
        <p className="mb-2 font-semibold">Updated: 16 December 2024</p>
      </section>
    </div>
  );
};

export default Cookies;


