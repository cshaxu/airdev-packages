/* "@airdev/next": "managed" */

import { PRIVACY_HREF, ROOT_HREF } from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import Header from '@/airdev/frontend/components/ui/Header';
import { pageTitle } from '@/airdev/frontend/utils/page';
import Link from 'next/link';

export const generateTermsMetadata = () => ({
  title: pageTitle('Terms of Service'),
});

const { app } = airdevPublicConfig;

export default function Terms() {
  return (
    <>
      <Header title="Terms of Service">
        <Link href={ROOT_HREF} />
      </Header>

      <section className="mb-6 flex flex-col gap-y-3">
        <p>Last Updated: March 25, 2026</p>
        <p>
          Please read these terms of service (“Agreement” or “Terms of Use”)
          carefully before using the services offered by {app.owner}
          (“Company”). This agreement sets forth the legally binding terms and
          conditions for your and your business or other legal entity’s (“you”)
          use of the various websites owned and operated by Company, including,
          without limitation, the{' '}
          <a href={airdevPublicConfig.service.baseUrl} className="link-primary">
            {app.name}
          </a>{' '}
          website and domain name (“Sites”), and any other features, content, or
          applications offered from time to time in connection therewith
          (collectively, the “Service”). By using the sites or service in any
          manner, including but not limited to visiting or browsing the sites,
          you agree to be bound by this agreement.
        </p>
        <p>
          This agreement applies to all users of the sites or service, including
          users who are also contributors of content, information, and other
          materials or services on the sites. By entering into this agreement on
          behalf of a company or other legal entity, you represent that you have
          the authority to bind such entity to this agreement and that you are
          of legal age to form a binding contract.
        </p>
        <h2 className="font-bold">Acceptance of Terms</h2>
        <p>
          The Service is offered subject to acceptance without modification of
          these Terms of Use and all other operating rules, policies and
          procedures that may be published from time to time on the Sites by
          Company. In addition, some services offered through the Service may be
          subject to additional terms and conditions promulgated by Company from
          time to time; your use of such services is subject to those additional
          terms and conditions, which are incorporated into these Terms of Use
          by this reference.You represent and warrant that all registration
          information you submit is accurate and truthful; and that your use of
          the Service does not violate any applicable law or regulation. Company
          may, in its sole discretion, refuse to offer the Service to any entity
          and change its eligibility criteria at any time. This provision is
          void where prohibited by law and the right to access the Service is
          revoked in such jurisdictions.
        </p>
        <h2 className="font-bold">Modification of Terms of Use</h2>
        <p>
          Company reserves the right, at its sole discretion, to modify or
          replace any of the Terms of Use, or change, suspend, or discontinue
          the Service (including without limitation, the availability of any
          feature, database, or content) at any time by posting a notice on the
          Sites or by sending you an email. Company may also impose limits on
          certain features and services or restrict your access to parts or all
          of the Service without notice or liability. It is your responsibility
          to check the Terms of Use periodically for changes. Your continued use
          of the Service following the posting of any changes to the Terms of
          Use constitutes acceptance of those changes.
        </p>
        <h2 className="font-bold">Privacy</h2>
        <p>
          Company’s current privacy policy is located at{' '}
          <a
            href={`${airdevPublicConfig.service.baseUrl}${PRIVACY_HREF}`}
            className="link-primary"
          >
            {`${airdevPublicConfig.service.baseUrl}${PRIVACY_HREF}`}
          </a>{' '}
          (the “Privacy Policy”) and is incorporated into these Terms of Use by
          this reference. For inquiries in regard to the Privacy Policy, or to
          report a privacy-related problem, please contact{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
        </p>
        <h2 className="font-bold">Registration</h2>
        <p>
          As a condition to using certain aspects of the Service, you will be
          required to register with the Company and select a password and email
          address. You shall provide the Company with accurate, complete, and
          updated registration information. Failure to do so shall constitute a
          breach of the Terms of Use, which may result in immediate termination
          of your Company account. You shall not select or use an email address
          of another person with the intent to impersonate that person. Company
          reserves the right to refuse registration of, or cancel a Company
          account in its sole discretion. You are solely responsible for
          activity that occurs on your account and shall be responsible for
          maintaining the confidentiality of your Company password. You shall
          never use another’s account without such other user’s express
          permission. You will immediately notify Company in writing of any
          unauthorized use of your account, or other account related security
          breach of which you are aware. Company shall have the right to use
          Customer’s name in a factual manner for marketing or promotional
          purposes on Company’s website and in other communication with existing
          or potential customers. To refuse Company this right, Customer must
          email Company (at the email address provided in the Service) stating
          that Customer does not wish to grant Company this right. If any
          provision of this Agreement is found to be unenforceable or invalid,
          that provision will be limited or eliminated to the minimum extent
          necessary so that this Agreement will otherwise remain in effect and
          enforceable.
        </p>
        <h2 className="font-bold">Services</h2>
        <p>
          Customer shall have the right to grant users, including its employees,
          investors, vendors, advisors and agents, access to its account for use
          of the Services in accordance with this Agreement (“Authorized Users”)
          and designate which Authorized Users shall have administrative
          privileges. Customer is solely responsible for ensuring Authorized
          Users comply with the Agreement. Customer shall be responsible for all
          activities occurring under Customer’s account, including all
          activities of its Authorized Users, and for obtaining and maintaining
          any equipment and ancillary services needed to connect to, access or
          otherwise use the Services, including, without limitation, modems,
          hardware, servers, software, operating systems, networking, web
          servers and the like (collectively, “Equipment”). Customer shall also
          be responsible for maintaining the security of the Equipment, Customer
          account, passwords (including but not limited to administrative and
          Authorized User passwords) and files, and for all uses of Customer
          account or the Equipment with or without Customer’s knowledge or
          consent. Company may invite Customer to try certain services at no
          charge for a free trial or assessment or if such services are not
          widely available to customers (collectively, “Evaluation Services”).
          Evaluation Services will be identified as alpha, beta, trial, early
          access, limited release, pilot, evaluation, or similar. Evaluation
          Services are for Company’s internal analytical purposes only and not
          for production use, are not considered “Services” under this
          Agreement, are not supported, are provided “as is” without warranty of
          any kind, and may be subject to additional terms. Company may
          discontinue Evaluation Services at any time in its sole discretion and
          may never make them generally available. Company will have no
          liability for any harm or damage arising out of or in connection with
          any Evaluation Services.
        </p>
        <h2 className="font-bold">
          Consent to Receive Electronic Communications from Company
        </h2>
        <p>
          By registering for the Service and providing your name, email, postal
          or residential address, and/or phone number through the Service, you
          expressly consent to receive electronic and other communications from
          Company, over the short term and periodically, including email
          communications. These communications will be about the Service, new
          product offers, promotions, and other matters. You may opt-out of
          receiving electronic communications at any time by following the
          unsubscribe instructions contained in each communication, or by
          sending an email to{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
          . You agree that these electronic communications satisfy any legal
          requirements that communications or notices to you be in writing.
        </p>
        <h2 className="font-bold">
          Account Information from Third Party Sites
        </h2>
        <p>
          Through the service, you may direct Company to retrieve certain
          information maintained online by third-party services or providers
          with which you have a customer relationship, maintain accounts or
          engage in transactions (“account information”). You agree to provide
          your username, password, pin and other log-in information and
          credentials necessary to access your account with such institutions or
          providers (“access information”), and you hereby grant company
          permission to use the access information and account information for
          the purposes contemplated by this agreement. By using the service, you
          expressly authorize Company to access, store and use your account
          information maintained by identified third parties, on your behalf as
          your agent. You hereby authorize Company to store and use your access
          information to accomplish the foregoing and to configure the service
          so that it is compatible with the third party sites for which you
          submit account information. This may include, without limitation,
          monitoring your usage (including the location of relevant clicks and
          links) of such third party sites (when accessed through the service)
          solely to facilitate such compatibility and our contemplated access to
          your relevant account information in connection with the service. For
          purposes of this agreement, you grant company a limited power of
          attorney, and appoint Company as your attorney-in-fact and agent, to
          access third party sites using access information, and to retrieve,
          store and use your account information with the full power and
          authority to do and perform each thing necessary in connection with
          such activities, as you could do in person solely in connection with
          company’s provision of the service. You acknowledge and agree that
          when Company accesses and retrieves account information from third
          party sites, Company is acting as your agent, and not as the agent of
          or on behalf of the third party. You acknowledge and agree that the
          foregoing does not imply sponsorship or endorsement by any third party
          services accessible through the service. You represent and warrant
          that neither the foregoing (or anything else in this agreement) nor
          your use of the services will violate any agreement or terms to which
          you are subject, including without limitation, those with respect to
          any third party site or service.
        </p>
        <h2 className="font-bold">Rules and Conduct</h2>
        <p>
          You may not use the Service for any purpose that is prohibited by
          these Terms of Use. The Service is provided only for your internal use
          in connection with your lawful business activities. You are
          responsible for all of your activity in connection with the Service.
          For purposes of the Terms of Use, the term “Content” includes, without
          limitation, any advertisements, advice, suggestions, blogs or forum
          comments, information, data, text, photographs, software, scripts,
          graphics, and interactive features generated, provided, or otherwise
          made accessible by Company or its partners on or through the Service.
          By way of example, and not as a limitation, you shall not (and shall
          not permit any third party to) either (a) take any action or (b) post
          any content on or through the Service, that:
        </p>
        <ul className="list-inside list-disc pl-5">
          <li>
            infringes any intellectual property or other proprietary right of
            any other person or entity;
          </li>
          <li>
            is unlawful, threatening, abusive, harassing, defamatory, libelous,
            deceptive, fraudulent, invasive of another’s privacy, tortious,
            obscene, offensive, or profane;
          </li>
          <li>
            constitutes unauthorized or unsolicited advertising, junk or bulk
            e-mail (“spamming”);
          </li>
          <li>
            involves commercial activities and/or sales without Company’s prior
            written consent, such as contests, sweepstakes, barter, advertising,
            or pyramid schemes;
          </li>
          <li>
            contains software viruses or any other computer codes, files, or
            programs that are designed or intended to disrupt, damage, limit or
            interfere with the proper function of any software, hardware, or
            telecommunications equipment or to damage or obtain unauthorized
            access to any system, data, password or other information of Company
            or any third party; or
          </li>
          <li>
            {' '}
            impersonates any person or entity, including any employee or
            representative of Company.
          </li>
        </ul>
        <p>
          Additionally, you shall not: (i) take any action that imposes or may
          impose (as determined by Company in its sole discretion) an
          unreasonable or disproportionately large load on Company’s (or its
          third party providers’) infrastructure; (ii) interfere or attempt to
          interfere with the proper working of the Service or any activities
          conducted on the Service; (iii) bypass any measures Company may use to
          prevent or restrict access to the Service (or other accounts, computer
          systems or networks connected to the Service); (iv) run Maillist,
          Listserv, any form of auto-responder or “spam” on the Service; or (v)
          use manual or automated software, devices, or other processes to
          “crawl” or “spider” any page of the Sites. You shall not (directly or
          indirectly): (i) decipher, decompile, disassemble, reverse engineer or
          otherwise attempt to derive any source code or underlying ideas or
          algorithms of any part of the Service, except to the limited extent
          applicable laws specifically prohibit such restriction, (ii) modify,
          translate, or otherwise create derivative works of any part of the
          Service, (iii) copy, rent, lease, distribute, or otherwise transfer
          any or all of the rights that you receive hereunder, or (iv) use or
          access the Service in order to build a competitive product or service.
          You shall abide by all applicable local, state, national and
          international laws and regulations when using the Service. Company
          reserves the right to remove any Content from the Sites or Service at
          any time, for any reason (including, but not limited to, upon receipt
          of claims or allegations from third parties or authorities relating to
          such Content or if Company is concerned that you may have violated the
          Terms of Use), or for no reason at all.
        </p>
        <h2 className="font-bold">Company and Site Content</h2>
        <p>
          You agree that the Service contains Content specifically provided by
          Company or its partners and that such Content is protected by
          copyrights, trademarks, service marks, patents, trade secrets or other
          proprietary rights and laws. You shall abide by all copyright notices,
          information, and restrictions contained in any Content accessed
          through the Service. You shall not sell, license, rent, modify,
          distribute, copy, reproduce, transmit, publicly display, publicly
          perform, publish, adapt, edit, create derivative works from, or
          otherwise exploit any Content or third party submissions or other
          proprietary rights not owned by you (i) without the consent of the
          respective owners or other valid right, and (ii) in any way that
          violates any third party right. You may, to the extent the Sites
          expressly authorize you to do so, download or copy the Content, and
          other items displayed on the Sites for download, for your internal
          business use only, provided that you maintain all copyright and other
          notices contained in such Content. You shall not store any significant
          portion of any Content in any form. Copying or storing of any Content
          for other than for your internal business use is expressly prohibited
          without prior written permission from Company, or from the copyright
          holder identified in such Content’s copyright notice.
        </p>
        <h2 className="font-bold">Confidentiality and Feedback</h2>
        <p>
          Neither Company or Customer will use or disclose the other party’s
          Confidential Information without the other’s prior written consent,
          except for the purpose of exercising rights under or performing this
          Agreement, or if required by law, regulation or court order; in which
          case, the party being compelled to disclose Confidential Information
          will give the other party as much notice as is reasonably practicable
          before disclosing the Confidential Information. When Customer provide
          Company with any suggestions, information, ideas, or feedback
          concerning {app.ownerShort}, its functionality and features, or any
          model, report or output, errors discovered, or any suggestions for or
          relating to any models or output (“Feedback”) while using {app.name},
          such Feedback will be the property of Company. You agree to assign,
          and hereby assign, all right, title and interest worldwide in the
          Feedback, and the related intellectual property rights, to Company and
          agree to assist Company in perfecting and enforcing these rights.
        </p>
        <h2 className="font-bold">License</h2>
        <p>
          Subject to your compliance with these Terms of Use, Company grants you
          a non-exclusive, non-sublicensable, revocable as stated in this
          Agreement, non-transferable license to access the Company websites
          (located at the following URL:{' '}
          <a href={airdevPublicConfig.service.baseUrl} className="link-primary">
            {airdevPublicConfig.service.baseUrl}
          </a>{' '}
          ), and to use the Service. No part of the Service, including the
          Website, may be reproduced, duplicated, copied, modified, sold,
          resold, distributed, transmitted, or otherwise exploited for any
          commercial purpose without the prior express written consent of the
          Company. All rights not expressly granted in this Agreement are
          reserved by the Company. Without limitation, this Agreement grants you
          no rights to the intellectual property of the Company or any other
          party, except as expressly stated in this Agreement. The license
          granted in this section is conditioned on your compliance with this
          Agreement. Your rights under this section will immediately terminate
          if, in the sole judgment of Company, you have breached any provision
          of this Agreement.
        </p>
        <h2 className="font-bold">Termination</h2>
        <p>
          Company may terminate your access to all or any part of the Service at
          any time, with or without cause, with or without notice, effective
          immediately, which may result in the forfeiture and destruction of all
          information associated with your membership. If you wish to terminate
          your account, you may do so by following the instructions on the
          Sites. Any fees paid hereunder are non-refundable. All provisions of
          the Terms of Use which by their nature shall survive termination,
          including, without limitation, ownership provisions, warranty
          disclaimers, indemnity and limitations of liability.If Company, in
          Company’s discretion, takes legal action against you in connection
          with any actual or suspected breach of this Agreement, Company will be
          entitled to recover from you as part of such legal action, and you
          agree to pay, Company’s reasonable costs and attorneys’ fees incurred
          as a result of such legal action. The Company Parties will have no
          legal obligation or other liability to you or to any third party
          arising out of or relating to any termination of this Agreement.
        </p>
        <h2 className="font-bold">Warranty Disclaimer</h2>
        <p>
          Company makes no representations concerning any content contained in
          or accessed through the sites, and company will not be responsible or
          liable for the reliability, timeliness, quality, suitability,
          availability, accuracy, completeness, copyright compliance, legality
          or decency of any content or material contained in or accessed through
          the sites. You should independently verify all content and other
          information that you access through the service. By using the service,
          you agree that company shall not be responsible for (1) any content,
          (2) any person’s reliance on any such content, whether or not correct,
          current and complete, or (3) the consequences of any action that you
          or any other person takes or fails to take based on any content or
          otherwise as a result of your use of the service. Your use of or
          reliance on any content is at your own risk. The service (including,
          without limitation, any content) is provided “As is” and “As
          available” and is without warranty of any kind, express or including,
          but not limited to, the implied warranties of title, non-infringement,
          merchantability and fitness for a particular purpose, and any
          warranties implied by any course of performance or usage of trade, all
          of which are expressly disclaimed. Company, and its directors,
          employees, agents, suppliers, partners and content providers do not
          warrant that: (a) the service will be secure or available at any
          particular time or location; (b) the use of the service will be
          secure, timely, uninterrupted or error-free, or operate in combination
          with any other hardware, software, system or data; (b) any defects or
          errors will be corrected; (c) any content or software available at or
          through the service is free of viruses or other harmful components; or
          (d) the results of using the service will meet your requirements or
          expectations. Your use of the service is solely at your own risk. The
          services may be subject to limitations, delays, and other problems
          inherent in the use of the internet and electronic communications, and
          Company is not responsible for any delays, delivery failures, or other
          damage resulting from such problems. Some states do not allow
          limitations on how long an implied warranty lasts, so the above
          limitations may not apply to you. Electronic communications privacy
          act notice (18 usc 2701-2711): company makes no guaranty of
          confidentiality or privacy of any communication or information
          transmitted on the sites or any website linked to the sites.Company
          will not be liable for the privacy of email addresses, registration
          and identification information, disk space, communications,
          confidential or trade-secret information, or any other content stored
          on company’s equipment, transmitted over networks accessed by the
          sites, or otherwise connected with your use of the service.
        </p>
        <h2 className="font-bold">Indemnification</h2>
        <p>
          You shall defend, indemnify, and hold harmless Company, its affiliates
          and each of its, and its affiliates employees, contractors, directors,
          suppliers and representatives from all liabilities, claims, and
          expenses, including reasonable attorneys’ fees, that arise from or
          relate to (i) your use or misuse of, or access to, the Sites, Service,
          Content, or otherwise from any content that you post to the Sites,
          (ii) your violation of the Terms of Use, or (iii) infringement by you,
          or any third party using the your account, of any intellectual
          property or other right of any person or entity. Company reserves the
          right to assume the exclusive defense and control of any matter
          otherwise subject to indemnification by you, in which event you will
          assist and cooperate with Company in asserting any available defenses.
        </p>
        <h2 className="font-bold">Limitation of Liability</h2>
        <p>
          In no event shall company, nor its directors, employees, agents,
          partners, suppliers or content providers, be liable under contract,
          tort, strict liability, negligence or any other legal or equitable
          theory with respect to the service (including, without limitation, any
          content) (I) for any lost profits, data loss, cost of procurement of
          substitute goods or services, or special, indirect, incidental,
          punitive, or consequential damages of any kind whatsoever (however
          arising), (ii) for any bugs, viruses, trojan horses, or the like
          (regardless of the source), (iii) for your reliance on the service or
          (iv) for any direct damages in excess of (in the aggregate)
          one-hundred U.S. Dollars ($100.00) or, if greater, the fees paid by
          you for the service in the preceding six (6) month period. Some states
          do not allow the exclusion or limitation of incidental or
          consequential damages, so the above limitations and exclusions may not
          apply to you.
        </p>
        <h2 className="font-bold">International Use</h2>
        <p>
          Company makes no representation that the Content is appropriate or
          available for use in locations outside of United States, and accessing
          the Service is prohibited from territories where such Content is
          illegal. If you access the Service from other locations, you do so at
          your own initiative and are responsible for compliance with local
          laws.
        </p>
        <h2 className="font-bold">Dispute Resolution</h2>
        <p>
          A printed version of the Terms of Use and of any notice given in
          electronic form shall be admissible in judicial or administrative
          proceedings based upon or relating to the Terms of Use to the same
          extent and subject to the same conditions as other business documents
          and records originally generated and maintained in printed form. You
          and Company agree that any cause of action arising out of or related
          to the Service must commence within one (1) year after the cause of
          action arose; otherwise, such cause of action is permanently barred.
          The Terms of Use shall be governed by and construed in accordance with
          the laws of the State of California, excluding its conflicts of law
          rules. Any dispute arising from or relating to the subject matter of
          this Agreement shall be finally settled by arbitration in San
          Francisco County, California, using the English language in accordance
          with the Arbitration Rules and Procedures of Judicial Arbitration and
          Mediation Services, Inc. (“JAMS”) then in effect, by one commercial
          arbitrator with substantial experience in resolving intellectual
          property and commercial contract disputes, who shall be selected from
          the appropriate list of JAMS arbitrators in accordance with the
          Arbitration Rules and Procedures of JAMS. The prevailing party in the
          arbitration shall be entitled to receive reimbursement of its
          reasonable expenses (including reasonable attorneys’ fees, expert
          witness fees and all other expenses) incurred in connection therewith.
          Judgment upon the award so rendered may be entered in a court having
          jurisdiction or application may be made to such court for judicial
          acceptance of any award and an order of enforcement, as the case may
          be. Notwithstanding the foregoing, each party shall have the right to
          institute an action in a court of proper jurisdiction for injunctive
          or other equitable relief pending a final decision by the arbitrator.
          For all purposes of this Agreement, the parties consent to exclusive
          jurisdiction and venue in the United States Federal Courts located in
          the Northern District of California. Use of the Service is not
          authorized in any jurisdiction that does not give effect to all
          provisions of the Terms of Use, including without limitation, this
          section.
        </p>
        <h2 className="font-bold">Integration and Severability</h2>
        <p>
          The Terms of Use are the entire agreement between you and Company with
          respect to the Service and use of the Sites, and supersede all prior
          or contemporaneous communications and proposals (whether oral, written
          or electronic) between you and Company with respect to the Sites. If
          any provision of the Terms of Use is found to be unenforceable or
          invalid, that provision will be limited or eliminated to the minimum
          extent necessary so that the Terms of Use will otherwise remain in
          full force and effect and enforceable. The failure of either party to
          exercise in any respect any right provided for herein shall not be
          deemed a waiver of any further rights hereunder.
        </p>
        <h2 className="font-bold">Government Restrictions</h2>
        <p>
          Customer may not remove or export from the United States or allow the
          export or re-export of {app.name}. As defined in FAR section 2.101,
          the Software and documentation are “commercial items” and according to
          DFAR section 252.2277014(a)(1) and (5) are deemed to be “commercial
          computer software” and “commercial computer software documentation.”
          Consistent with DFAR section 227.7202 and FAR section 12.212, any use
          modification, reproduction, release, performance, display, or
          disclosure of such commercial software or commercial software
          documentation by the U.S. Government will be governed solely by the
          terms of this Agreement and will be prohibited except to the extent
          expressly permitted by the terms of this Agreement.
        </p>
        <h2 className="font-bold">Fees and Payment</h2>
        <p>
          You may be required to purchase or pay a fee to access some of our
          services. You agree to provide current, complete, and accurate
          purchase and account information for all purchases made via the Site.
          You further agree to promptly update account and payment information,
          including email address, payment method, and payment card expiration
          date, so that we can complete your transactions and contact you as
          needed. We bill you through an online billing account for purchases
          made via the Site. Sales tax will be added to the price of purchases
          as deemed required by us. We may change prices at any time. All
          payments shall be in U.S. dollars. You agree to pay all charges or
          fees at the prices then in effect for your purchases, and you
          authorize us to charge your chosen payment provider for any such
          amounts upon making your purchase. If your purchase is subject to
          recurring charges, then you consent to our charging your payment
          method on a recurring basis without requiring your prior approval for
          each recurring charge, until you notify us of your cancellation. We
          reserve the right to correct any errors or mistakes in pricing, even
          if we have already requested or received payment. We also reserve the
          right to refuse any order placed through the Site.
        </p>
        <h2 className="font-bold">Free Trial</h2>
        <p>
          We may offer a free trial to new users who register with the Site. The
          account will not be charged and the subscription will be suspended
          until upgraded to a paid version at the end of the free trial.
        </p>
        <h2 className="font-bold">Data Retention</h2>
        <p>
          Even after you have stopped using our software, all information and
          files you’ve input and uploaded on {app.name} will be kept for at
          least one year. Please reach out to us at{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
          if you need to access your data after cancellation. After one year of
          inactivity without payment, we may erase or delete all information
          saved on {app.name}. At any point of time, if you request the account
          deletion, all your information and data will be fully deleted.
        </p>
        <h2 className="font-bold">Cancellation</h2>
        <p>
          All purchases are non-refundable. You can cancel your subscription at
          any time by contacting us using the contact information provided
          below. Your cancellation will take effect at the end of the current
          paid term. If you are have questions about our services, please email
          us at{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
        </p>
        <h2 className="font-bold">Geenral</h2>
        <p>
          Company shall not be liable for any failure to perform its obligations
          hereunder where such failure results from any cause beyond Company’s
          reasonable control, including, without limitation, mechanical,
          electronic or communications failure or degradation (including
          “line-noise” interference). The Terms of Use are personal to you, and
          you, and are not assignable, transferable or sub-licensable by you
          except with Company’s prior written consent. Company may assign,
          transfer or delegate any of its rights and obligations hereunder
          without consent. No agency, partnership, joint venture, or employment
          relationship is created as a result of the Terms of Use and neither
          party has any authority of any kind to bind the other in any respect.
          In any action or proceeding to enforce rights under the Terms of Use,
          the prevailing party will be entitled to recover costs and attorneys’
          fees. All notices under the Terms of Use will be in writing and will
          be deemed to have been duly given when received, if personally
          delivered or sent by certified or registered mail, return receipt
          requested; when receipt is electronically confirmed, if transmitted by
          facsimile or e-mail; or the day after it is sent, if sent for next day
          delivery by recognized overnight delivery service.
        </p>
        <h2 className="font-bold">Copyright and Trademark Notices</h2>
        <p>
          Unless otherwise indicated, the Terms of Use and all Content provided
          by Company are copyright © 2026 {app.owner}. All rights reserved.
        </p>
        <h2 className="font-bold">Corrections</h2>
        <p>
          There may be information on the Site that contains typographical
          errors, inaccuracies, or omissions, including descriptions, pricing,
          availability, and various other information. We reserve the right to
          correct any errors, inaccuracies, or omissions and to change or update
          the information on the Site at any time, without prior notice.
        </p>
        <h2 className="font-bold">Notices</h2>
        <p>
          All notices required or permitted to be given under this Agreement
          must be in writing. Company shall give any notice by email sent to the
          most recent email address, if any, provided by the intended recipient
          to Company. You agree that any notice received from the Company
          electronically satisfies any legal requirement that such notice be in
          writing. You bear the sole responsibility of ensuring that your email
          address on file with Company is accurate and current, and notice to
          you shall be deemed effective upon the sending by Company of an email
          to that address.
        </p>
        <h2 className="font-bold">Contact</h2>
        <p>
          You may contact Company by email to{' '}
          <a href={`mailto:${app.email}`} className="link-primary">
            {app.email}
          </a>{' '}
        </p>
      </section>
    </>
  );
}
