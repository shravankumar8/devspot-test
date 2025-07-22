import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";

const TermsService = () => {
  return (
    <div className=" relative">
      <div className="">
        <div className="dark min-h-screen bg-background text-foreground">
          <div className="container mx-auto px-4 py-8 flex h-full justify-center items-center w-full md:flex-row">
            <div className="md:w-3/4 lg:w-4/5 mt-5 md:mt-0">
              <h1 className="text-[32px] font-semibold mb-3">
                Terms of Service
              </h1>
              <p className="text-base text-secondary-text mb-10 font-roboto">
                Last updated May 14, 2025
              </p>

              {/* Section 1: Acceptance of Terms */}
              <div className="pb-5 font-roboto text-sm">
                <h2 className=" font-meduim mb-5 uppercase">
                  AGREEMENT TO TERMS{" "}
                </h2>
                <p>
                  These Terms and Conditions constitute a legally binding
                  agreement made between you, whether personally or on behalf of
                  an entity (“you”) and DevSpot Corporation (“we,” “us” or
                  “our”), concerning your access to and use of the
                  www.devspot.app website as well as any other media form, media
                  channel, mobile website or mobile application related, linked,
                  or otherwise connected thereto (collectively, the “Site”). You
                  agree that by accessing the Site, you have read, understood,
                  and agree to be bound by all of these Terms and Conditions. If
                  you do not agree with all of these Terms and Conditions, then
                  you are expressly prohibited from using the Site and you must
                  discontinue use immediately. Supplemental terms and conditions
                  or documents that may be posted on the Site from time to time
                  are hereby expressly incorporated herein by reference. We
                  reserve the right, in our sole discretion, to make changes or
                  modifications to these Terms and Conditions at any time and
                  for any reason. We will alert you about any changes by
                  updating the “Last updated” date of these Terms and
                  Conditions, and you waive any right to receive specific notice
                  of each such change. It is your responsibility to periodically
                  review these Terms and Conditions to stay informed of updates.
                  You will be subject to, and will be deemed to have been made
                  aware of and to have accepted, the changes in any revised
                  Terms and Conditions by your continued use of the Site after
                  the date such revised Terms and Conditions are posted. The
                  information provided on the Site is not intended for
                  distribution to or use by any person or entity in any
                  jurisdiction or country where such distribution or use would
                  be contrary to law or regulation or which would subject us to
                  any registration requirement within such jurisdiction or
                  country. Accordingly, those persons who choose to access the
                  Site from other locations do so on their own initiative and
                  are solely responsible for compliance with local laws, if and
                  to the extent local laws are applicable. The Site is intended
                  for users who are at least 13 years of age. All users who are
                  minors in the jurisdiction in which they reside (generally
                  under the age of 18) must have the permission of, and be
                  directly supervised by, their parent or guardian to use the
                  Site. If you are a minor, you must have your parent or
                  guardian read and agree to these Terms and Conditions prior to
                  you using the Site. INTELLECTUAL PROPERTY RIGHTS Unless
                  otherwise indicated, the Site is our proprietary property and
                  all source code, databases, functionality, software, website
                  designs, audio, video, text, photographs, and graphics on the
                  Site (collectively, the “Content”) and the trademarks, service
                  marks, and logos contained therein (the “Marks”) are owned or
                  controlled by us or licensed to us, and are protected by
                  copyright and trademark laws and various other intellectual
                  property rights and unfair competition laws of the United
                  States, foreign jurisdictions, and international conventions.
                  The Content and the Marks are provided on the Site “AS IS” for
                  your information and personal use only. Except as expressly
                  provided in these Terms and Conditions, no part of the Site
                  and no Content or Marks may be copied, reproduced, aggregated,
                  republished, uploaded, posted, publicly displayed, encoded,
                  translated, transmitted, distributed, sold, licensed, or
                  otherwise exploited for any commercial purpose whatsoever,
                  without our express prior written permission. Provided that
                  you are eligible to use the Site, you are granted a limited
                  license to access and use the Site and to download or print a
                  copy of any portion of the Content to which you have properly
                  gained access solely for your personal, non-commercial use. We
                  reserve all rights not expressly granted to you in and to the
                  Site, the Content and the Marks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TermsService;
