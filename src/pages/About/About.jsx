import React from "react";
import "./About.css";
import AboutHero from "../../components/AboutHero/AboutHero";
import WhyUs from "../../components/WhyUs/WhyUs";
import CallToAction from "../../components/CallToAction/CallToAction";
import WorkTime from "../../components/WorkTime/WorkTime";

const About = ({ setMenu }) => {
  return (
    <div>
      <AboutHero />
      <WhyUs />
      <WorkTime centrirano={1} />
      <CallToAction />
    </div>
  );
};

export default About;
