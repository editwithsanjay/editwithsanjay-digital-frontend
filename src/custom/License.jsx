import React from 'react';

const License = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4" >Regular License</h1>

      <section className="mb-6">
        <p className="mb-2">
          1. This Regular License provides you, the buyer, with an ongoing, non-exclusive,
          worldwide license to use the digital content (“Item”) that you have chosen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Usage Rights</h2>
        <p className="mb-2">
          2. You are permitted to use the Item to create a single End Product for yourself or
          for one client (referred to as a "single application"), and you may sell the End Product.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Permitted Uses</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            3. You may create an End Product for a client, transferring the license to them
            upon completion.
          </li>
          <li>
            4. You are allowed to sell and distribute unlimited copies of the single End Product.
          </li>
          <li>
            5. You can modify, manipulate, or combine the Item with other content to create
            derivative works. Any resulting work is still subject to the terms of this license.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Additional Terms and Conditions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            6. Some Items may include components sourced from third parties, subject to different
            license terms (e.g., open source or Creative Commons licenses). Such components will
            be identified in the Item’s description or included files, and their respective
            licenses will apply instead of this one. The rest of the Item remains covered by this license.
          </li>
          <li>
            7. Certain Items may partially fall under the GNU General Public License (GPL) or
            another open-source license, resulting in a split license. This means the open-source
            license governs applicable portions of the Item, while the rest remains under this license.
          </li>
          <li>
            8. The Item may only be used for lawful purposes. If the Item contains an image of a
            person, even with a model release, it cannot be used to create fake identities, imply
            personal endorsement of a product, or in ways that are defamatory, obscene, demeaning,
            or associated with sensitive topics.
          </li>
          <li>
            9. Items that depict real-world products, trademarks, or intellectual property may not
            have been cleared for commercial use. Such Items are licensed for editorial use only,
            and it is your responsibility to obtain any necessary permissions from the intellectual
            property owner.
          </li>
          <li>
            10. This license may be terminated if its terms are violated. Upon termination, you
            must cease distribution of the End Product and remove the Item from it.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default License;
