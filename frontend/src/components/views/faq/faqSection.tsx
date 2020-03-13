import React from "react";
import { Container } from "react-bootstrap";

import FAQElement from "./faqElement";
import { LinkItem } from "../../utils/navLinkUtils";

export const faqLink: LinkItem = {
  link: "/faq/",
  displayName: "Frequently Asked Questions"
};

export default () => {
  return (
    <div className="mb-4">
      <h2 className="text-center">FAQ</h2>
      <Container className="pb-4">
        <div className="pb-md-4 pt-2"></div>
        <FAQElement
          question={"How does CastSpot compare to similar servies?"}
          answer={
            "Conventional guest speaking services are often filled with randoms and spammers, cost money or require the user to go through long, manual authentication processes. CastSpot lets users connect with each other for free, is extremly fast to get started, simple to use, while ensuring that users are real Podcasters - no surprises, no hastle, no spam."
          }
        />
        <FAQElement
          question={"How do I know users on CastSpot are actually Podcasters?"}
          answer={
            "CastSpot reads in the RSS Feed of Podcasters and validates the information using the Podcast directory listennotes. It contains information on over 650,000 podcasts. It then sends a code to the email listed in the RSS feed (just like Spotify) that is used to confirm that they are actually the host."
          }
        />
        <FAQElement
          question={
            "My RSS feed cannot be read - why is this (and what is CORS)?"
          }
          answer={
            "For security reasons, most websites prevent other websites from accessing their content - this is because of a standard called CORS. For example, WordPress sites will block CastSpot from downloading any RSS feeds hosted on them by default. It is advised to instead upload the link that is hosted on your podcast host service instead, as these are usually aware of the fact that other services need to the read the RSS and have CORS disabled."
          }
        />
        <FAQElement
          question={"Can I manage multiple Podcasts from a single Account?"}
          answer={
            "This is a feature that will be added in (hopefully) the near future - I do not recommend making a seperate account just for this."
          }
        />
        <FAQElement
          question={
            "Where can I read or find out when someone applies to speaking on my Podcast?"
          }
          answer={"Guest speaking applications are sent by email."}
        />
        <FAQElement
          question={
            "Why do I have to set two emails? One to register my account and one in my contact details?"
          }
          answer={
            "CastSpot sends all emails to the email that you registered your account to. In your contact details, you have the option to ask other users to contact you via an alternative email, or simply leave it blank if you don't want to share your email."
          }
        />
        <FAQElement
          question={
            "Where can I read or find out when someone applies to speaking on my Podcast?"
          }
          answer={
            "Guest speaking applications are sent by email to the account that you registered with. This is NOT the email that you may have added in your contact details."
          }
        />
        <FAQElement
          question={
            "I am a legit Podcaster, but I keep getting rejected when I try to validate my RSS Feed - what is going on?"
          }
          answer={
            "Please make sure that your RSS feed is formatted correctly. Then, ensure that your Podcast is listed at listennotes.com. If you are on the most popular platforms (Apple, Spotify, Google, etc.), this should happen automatically and if it doesn't, you just need to wait a bit (or contact the owner of listennotes). I know from personal experience that it can take some time to get listed."
          }
        />
        <FAQElement
          question={"Are there restrictions to my use of the service?"}
          answer={
            "Yes. This is in part due to hosting and email sending costs, but also because the restrictions require the user to be more deliberate about how they post and send out applications. At the moment, you can only send 10 application requests and post two times each month."
          }
        />
        <FAQElement
          question={
            "There is no such thing as a free lunch - what's in it for you?"
          }
          answer={
            "At some point, if the idea is reasonably successful, I want to add a premium account option with more features or advertising. Right now, I am just validating my ideas. Either way, the platform will remain free to use and nobody is going to be forced."
          }
        />
      </Container>
    </div>
  );
};
