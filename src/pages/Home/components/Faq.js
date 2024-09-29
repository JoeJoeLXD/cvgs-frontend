// src/pages/Home/components/Faq.js
import React from "react";
import { Accordion } from "./Accordion";

const Faq = () => {
  const faqs = [
    {
      id: 1,
      question: "What is CVGS Insiders Club?",
      answer:
        "CVGS Insiders Club is an exclusive membership that allows gamers to access members-only features, events, personalized game recommendations, and much more. Joining the club is easy and enhances your experience with CVGS.",
    },
    {
      id: 2,
      question: "How do I sign up for CVGS?",
      answer:
        "To sign up for CVGS, simply click on 'Join Now' and fill out your details including a unique display name, valid email address, and a secure password. We also have captcha validation for enhanced security, and you will receive a verification email to complete your registration.",
    },
    {
      id: 3,
      question: "How can I view my game wishlist?",
      answer:
        "Once logged in, you can view and manage your game wishlist by navigating to the 'Wishlist' section in your profile. You can add, remove, or share your wishlist with friends and family.",
    },
    {
      id: 4,
      question: "Does CVGS support international payments?",
      answer:
        "Yes! CVGS accepts multiple forms of payment, including international credit cards and digital wallets. We strive to make transactions smooth and hassle-free for our global customers.",
    },
    {
      id: 5,
      question: "Can I write reviews for games I’ve purchased?",
      answer:
        "Absolutely! After purchasing a game, you can leave a review which will be moderated before it's published on the site. Your reviews help other members decide on their next game purchase.",
    },
    {
      id: 6,
      question: "Can I get a refund for my game purchase?",
      answer:
        "Refunds are available under certain conditions. If you experience issues with a game download or if there’s a technical error, you can contact our support team to request a refund. However, some restrictions may apply depending on the game's refund policy.",
    },
  ];

  return (
    <section className="my-10 p-7 border rounded dark:border-slate-700 shadow-sm">        
      <h1 className="text-2xl text-center font-semibold dark:text-slate-100 mb-3 underline underline-offset-8">Frequently Asked Questions</h1>    
            <div className="" id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
              { faqs.map((faq) => (
                <Accordion key={faq.id} faq={faq} /> 
              )) }
            </div>
      </section>
  );
};

export default Faq;

