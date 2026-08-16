/* "@airdev/next": "managed" */

import { ROOT_HREF } from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import Header from '@/airdev/frontend/components/ui/Header';
import { pageTitle } from '@/airdev/frontend/utils/page';
import Link from 'next/link';

const { app } = airdevPublicConfig;

export const generatePrivacyMetadata = () => ({
  title: pageTitle('Privacy Policy'),
  description: `This Privacy Policy is designed to help you understand how ${app.name} collects, uses, and shares your personal information, and to help you understand and exercise your privacy rights`,
});

export default function Privacy() {
  return (
    <>
      <Header title="Privacy Policy">
        <Link href={ROOT_HREF} />
      </Header>

      <section className="mb-6 flex flex-col gap-y-3">
        <p>Last Updated: March 25, 2026</p>
        <p>
          This privacy policy explains our practices regarding the collection,
          use and disclosure of information that we receive from the person or
          entity accessing our Site or using our Services (“you” or “your”),
          including in particular information which may be used to identify you
          as a natural person (“Personal Information”). This Privacy Policy sets
          forth the privacy practices of {app.owner}
          (“{app.ownerShort}”, “we” or “us” or “our”) for (1) our website
          located at {airdevPublicConfig.service.baseUrl} (the “Site”) and (2)
          all {app.ownerShort} software and applications (including, without
          limitation, mobile software and applications) (the “Software”) and all
          other {app.ownerShort} products or services provided otherwise made
          accessible on or through the Software or the Site (collectively the
          “Services”). This Privacy Policy does not apply to any third-party
          websites, services or applications, even if they are accessible
          through our Services.
        </p>
        <p>
          We reserve the right to change this Privacy Policy from time to time
          without notice to you. You should check here periodically to review
          the current Privacy Policy, which is effective as of the revision date
          listed above. Your use of the Services and submission of any
          information, including Personal Information, to us constitutes
          acceptance and understanding of this Privacy Policy.
        </p>
        <h2 className="font-bold">
          Types of Information & Personal Information Collected Through the
          Services
        </h2>
        <p>
          We may collect data, including Personal Information, directly from you
          or your organization or your client through our services such as:
        </p>
        <ul className="list-inside list-disc pl-5">
          <li>
            Your contact information (such as name, address, email address and
            phone number).
          </li>
          <li>Your login information (such as email and password).</li>
          <li>
            Your company information (such as entity name, entity type, address,
            phone number and logo).
          </li>
          <li>
            Information required for us to fulfill our contractual obligation to
            deliver products and services.
          </li>
          <li>
            Information that you provide in connection with your purchase or
            license of Services, including payment card information (card
            number, expiration date, verification code) or other billing
            information needed to process your purchase.
          </li>
          <li>
            Personal information contained in legal agreements (such as invoices
            and orders).
          </li>
          <li>
            Any other Information you submit to us in the form of an email or
            via any function within the Services (e.g., requests for demos,
            contact forms, job postings, comments, suggestions, feedback,
            opinions, media etc.).
          </li>
          <li>
            Preferences information such as email subscription type preferences
            and communication preferences.
          </li>
          <li>
            We may retain server logs which include the IP address of every
            request to our server.
          </li>
        </ul>
        <h2 className="font-bold">
          Types of Uses of Information & Personal Information
        </h2>
        <p>
          We collect, store and use the information as well as Personal
          Information you provide to us in various ways always in accordance
          with this Privacy Policy and as follows:
        </p>
        <ul className="list-inside list-disc pl-5">
          <li>To provide the Services;</li>
          <li>
            To process product orders received through the Services or other
            ways you communicate them to us (e.g., email, phone);
          </li>
          <li>To evaluate business opportunities;</li>
          <li>To effectuate or enforce a transaction or agreement;</li>
          <li>To adjust offerings or services provided by us to you;</li>
          <li>
            To provide you with information about our products and services that
            we believe you may find of interest, including to send you mailing
            lists, and marketing and promotional e-mails;
          </li>
          <li>To authenticate visitors to the Services;</li>
          <li>
            To generate de-identified and aggregated statistics data for any
            lawful purpose and as specified in the Terms;
          </li>
          <li>
            To be able to respond to requests or inquiries, and for similar,
            customer-service-related purposes;
          </li>
          <li>
            To respond to job applications. If you decide to apply for a job
            with us, you may submit your Personal Information and resume online.
            If you apply for a job with us through a third-party platform (such
            as Glassdoor or LinkedIn), we will collect certain Personal
            Information you make available to us through such third-party
            platform;
          </li>
          <li>
            We automatically collect through the Services information that is
            often not personally identifying, such as the website from which
            visitors came to the Services, Services visitors’ IP address,
            browser type and other information relating to the device through
            which they access the Services. We may combine this information with
            the Personal Information we have collected from you;
          </li>
          <li>
            To improve the Services and offerings or services provided by us and
            to better understand how users access and use the Services and
            offerings provided by us.
          </li>
        </ul>
        <p>
          While we implement reasonable security measures, no system is
          completely secure. We do not make any warranty, express, implied or
          otherwise, that we will be able to prevent loss, misuse, unauthorized
          access to, or alteration of personally identifiable information you
          provide to us. Therefore, we encourage you to exercise caution when
          sharing personal information.
        </p>
        <h2 className="font-bold">Limited Use Policy Compliance</h2>
        <p>
          {' '}
          {app.ownerShort} rigorously adheres to Google’s API Services User Data
          Policy, especially the Limited Use requirements and applies it across
          our data. Our usage and handling of data obtained via Google’s
          Restricted and Sensitive Scopes are governed by these stringent
          standards.
        </p>
        <p>
          <strong>Key points of our compliance include</strong>:
        </p>
        <ul>
          <li>
            Focused Data Usage: We strictly limit our use of user data to
            providing or enhancing user-facing features that are clearly visible
            and integral to our application’s interface.
          </li>
          <li>
            Restricted Data Transfer: Data transfer is permitted only under
            specific conditions such as user consent for improving app features,
            security reasons, legal compliance, or as part of corporate
            restructuring, always prioritizing user consent.
          </li>
          <li>
            No Human Access to Data: Human access to user data is forbidden
            unless explicitly agreed upon by the user, required for security or
            legal reasons, or when the data is aggregated for internal
            operational use, respecting privacy laws.
          </li>
          <li>
            Prohibition of Misuse: We do not transfer, sell, or use user data
            for advertising, eligibility assessments, or any unauthorized
            purposes.
          </li>
          <li>
            Compliance Across the Board: All our employees, agents, contractors,
            and successors are bound to uphold these standards.
          </li>
        </ul>
        <p>
          For detailed understanding, please refer to the{' '}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://developers.google.com/terms/api-services-user-data-policy"
          >
            Google API Services User Data Policy
          </a>
          .
        </p>
        <h2 className="font-bold">Cookies, Beacons and Analytics</h2>
        <p>
          When you interact with the Services, we strive to make your experience
          easy and meaningful. Our Services uses technology, or those of
          third-party service providers, such as cookies, web beacons (clear
          GIFs, web bugs) and similar technologies to track user activity and
          collect site data. We may combine this data with the Personal
          Information we have collected from you.
        </p>
        <h3>Cookies and Web beacons</h3>
        <p>
          We (including our chosen third-party service providers) may use
          cookies or web beacons to track visitor activity on the Services.
        </p>
        <p>
          <span className="font-bold">A Cookie </span>
          <span className="font-normal">
            is a text file that a website transfers to your computer’s hard
            drive for record-keeping purposes. Our cookies assign a random,
            unique number to each visitor’s computer. They do not contain
            information that would personally identify the visitor, although we
            can associate a cookie with any identifying information that is or
            has been provided to us while visiting the Services. We use cookies
            that remain on your computer for a specified period of time or until
            they are deleted (persistent cookies). We may also use cookies that
            exist only temporarily during an online session (session cookies) –
            these cookies allow us to identify you temporarily as you move
            through the Services. Most browsers allow users to refuse cookies
            but doing so may impede the functionality of some portions of our
            Services.
          </span>
        </p>
        <p>
          <span className="font-bold">Web Beacons </span>
          <span className="font-normal">
            are tiny graphics with a unique identifier, similar in function to
            cookies, that are used to track the online movements of Web users.
            In contrast to cookies, which are stored on your computer’s hard
            drive, Web beacons are embedded invisibly on webpages and may not be
            disabled or controlled through your browser.
          </span>
        </p>
        <h3>“Do Not Track” options</h3>
        <p>
          Although we do our best to honor the privacy preferences of our
          customers, we are not able to respond to Do-Not-Track signals from
          your browser at this time. As discussed above, we track websites and
          app usage information through the use of cookies for analytic and
          internal purposes only. Because we do not collect this information to
          track you across websites or apps over time, your selection of the “Do
          Not Track” option provided by your browser will not have any effect on
          our collection of cookie information for analytics or internal
          purposes.
        </p>
        <h3> How long do we keep your information? </h3>
        <p>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy policy, unless a
          longer retention period is required or permitted by law. No purpose in
          this policy will require us to keep your personal information for
          longer than the period of time in which users have an account with us.
        </p>
        <p>
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </p>
        <h3> Do we disclose any information to third parties?</h3>
        <p>
          We may also engage third parties to track and analyze Services
          activity on our behalf. To do so, these third parties may place
          cookies or web beacons to track user activity on our Services. We use
          the data collected by such third parties to administer and improve the
          quality of the Services, analyze usage of the Services, and provide a
          more enhanced user experience on the Services, such as personalizing
          and delivering relevant offers and content based on user activity on
          the Services.
        </p>
        <p>
          Except as set out below, we do not sell or trade your Personal
          Information. Non-personally identifiable visitor information, however,
          may be provided to third parties for marketing, advertising or other
          uses. We may disclose your Personal Information to our subsidiaries
          and affiliates, or to contractors, service providers, and other third
          parties we use to support our business. These third-party providers
          are not permitted to use the information collected on our behalf
          except to help us conduct and improve our business. We may also
          release your Personal Information when we believe release is
          appropriate to comply with the law, enforce our site policies or
          protect our or others’ rights, property or safety. Your Personal
          Information may also be transferred to another company in the event of
          a transfer, change of ownership, reorganization or assignment of all
          or part of our businesses or assets. This will occur if the parties
          have entered into an agreement under which the collection, use and
          disclosure of the information is limited to those purposes of the
          business transaction, including a determination whether or not to
          proceed with the business transaction. You will be notified via email
          or prominent notice on our websites for thirty (30) days of any such
          change in ownership or control of your Personal Information or as
          otherwise may be required or permitted by law.
        </p>
        <h3> Third-Party Links</h3>
        <p>
          The Services contain links to other, third-party websites. Any access
          to and use of such linked websites is not governed by this Privacy
          Policy, but, instead, is governed by the privacy policies of those
          third-party websites. We are not responsible for the information
          practices of such third-party websites.
        </p>
        <h2 className="font-bold">Email Policy</h2>
        <p>
          We may use your email address to share with you sign-in code,
          communicate with you about orders you have placed, inquiries you have
          made about our products and services, or information you have shared
          with us through the Services or email. We may send you emails from
          time-to-time, about information that we believe may be of interest to
          you. We may also send you news and offers about our products and
          services, or those of our chosen partners. Examples include, but are
          not limited to, our blog, newsletter, information about special
          offers, or other products or offerings.
        </p>
        <p>
          If, at any time, you would like to stop receiving these promotional
          e-mails, you may follow the opt-out instructions contained in any such
          e-mail. Please note that it may take a few business days for us to
          process opt-out requests. If you opt-out of receiving emails or
          promotions, we still may send you e-mails to you in accordance with
          this Privacy Policy, as requested by you, or in reference to other
          customer service purposes.
        </p>
        <h2 className="font-bold">International Users</h2>
        <p>
          If you are accessing the Services from outside the United States, by
          providing your information to the Services, you are consenting to and
          authorizing the transfer of your information to the United States for
          storage, use, processing, maintenance and onward transfer of such
          information to other entities, regardless of their location, in
          accordance with this Privacy Policy and the other applicable Terms.
          For clarity, and as outlined in the Terms, you are also consenting to
          the application of United States law in all matters concerning the
          Services.
        </p>
        <p>
          Personal data collected from the European Union and Switzerland will,
          for example, be transferred to and processed by us in the United
          States or another country outside of the European Union and
          Switzerland. In such instances, we shall ensure that the transfer of
          your personal data is carried out in accordance with applicable
          privacy laws and, in particular, that appropriate contractual,
          technical, and organisational measures are in place such as the
          Standard Contractual Clauses approved by the EU Commission.
        </p>
        <h2 className="font-bold">
          Your Data Protection Rights (California Residents)
        </h2>
        <p>
          If you are a resident of California and interact with us as a
          consumer, you have certain rights under the California Consumer
          Privacy Act or “CCPA” (Cal. Civ. Code § 1798.100 et seq.), including
          to request access to and deletion of your Personal Information (as
          defined in the CCPA). You may exercise these rights by contacting us
          at {app.email}. We do not sell your Personal Information, but we may
          allow our advertising partners to collect certain device identifiers
          and electronic network activity that allows them to show ads within
          their systems that are targeted to your interests. To opt out of
          having your Personal Information used for targeted advertising
          purposes, please visit{' '}
          <a href="http://www.aboutads.info/choices" className="link-primary">
            www.aboutads.info/choices
          </a>{' '}
          .
        </p>
        <h2 className="font-bold">Children’s Privacy</h2>
        <p>
          We do not knowingly collect, maintain, or use personal information
          from children under 13 years of age, and no parts of our Services are
          directed to children. If you learn that a child has provided us with
          personal information in violation of this Privacy Policy, then you may
          alert us at{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
          .
        </p>
        <h2 className="font-bold">Contact Us</h2>
        <p>
          While we strive for error free performance, we cannot always catch an
          unintended privacy issue. As a result, we encourage your questions and
          comments about any privacy concerns. Please direct them to us by an
          email to{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
          with the following information: Your name; Your company; Your title;
          Your country; Your state of residence; Your contact information.
        </p>
      </section>
    </>
  );
}
