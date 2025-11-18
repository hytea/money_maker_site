/**
 * SEO-optimized FAQs for each calculator
 * Based on real search queries and common questions
 */

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

export function getFAQs(toolPath: string): FAQ[] {
  const faqs: Record<string, FAQ[]> = {
    '/tip-calculator': [
      {
        question: 'What is the standard tip percentage in the US?',
        answer: '15-20% is standard for good service at restaurants. 15% for acceptable service, 18% for good service, and 20% or more for excellent service. For takeout, 10% is appropriate if you want to tip.'
      },
      {
        question: 'Should I tip on the pre-tax or post-tax amount?',
        answer: 'Either is acceptable, but tipping on the pre-tax amount is more common and saves you money. The difference is usually only a few cents to a dollar, but it adds up over time.'
      },
      {
        question: 'Do I need to tip if gratuity is included?',
        answer: 'No, if an automatic gratuity is already added to your bill (common for parties of 6+), you don\'t need to add more. However, you can add extra if service was exceptional.'
      },
      {
        question: 'How much should I tip for takeout?',
        answer: '10% for takeout is generous but not required. If someone took time to package your order carefully or the restaurant is struggling, a small tip is appreciated. $1-2 for simple orders is fine.'
      }
    ],
    '/loan-calculator': [
      {
        question: 'How is my monthly loan payment calculated?',
        answer: 'Your monthly payment is calculated using the loan amount, interest rate, and loan term. The formula accounts for both principal (the amount borrowed) and interest, distributed evenly over the loan period.'
      },
      {
        question: 'What happens if I make extra payments on my loan?',
        answer: 'Extra payments go directly toward your principal balance, reducing the total interest you\'ll pay and shortening your loan term. Even small extra payments (like $50-100/month) can save thousands in interest.'
      },
      {
        question: 'Should I get a 15-year or 30-year mortgage?',
        answer: '15-year mortgages have higher monthly payments but lower interest rates and you\'ll pay far less interest overall. 30-year mortgages have lower monthly payments, giving you more flexibility. Choose based on your budget and financial goals.'
      },
      {
        question: 'What is APR and how is it different from interest rate?',
        answer: 'APR (Annual Percentage Rate) includes the interest rate plus additional costs like origination fees and closing costs. It gives you a more accurate picture of the loan\'s true cost. Always compare APRs, not just interest rates.'
      },
      {
        question: 'How much can I afford to borrow?',
        answer: 'A general rule: your monthly housing payment (including principal, interest, taxes, and insurance) shouldn\'t exceed 28% of your gross monthly income. Total debt payments shouldn\'t exceed 36% of gross income.'
      }
    ],
    '/pregnancy-calculator': [
      {
        question: 'How accurate are pregnancy due dates?',
        answer: 'Due dates are estimates. Only about 5% of babies arrive exactly on their due date. Most babies arrive between 37-42 weeks, which is considered full term. First-time mothers often go past their due date.'
      },
      {
        question: 'Why is pregnancy calculated from my last period?',
        answer: 'Pregnancy is dated from the first day of your last menstrual period (LMP) because ovulation typically occurs about 2 weeks after your period starts. This means you\'re considered "2 weeks pregnant" at conception.'
      },
      {
        question: 'When will I find out the baby\'s gender?',
        answer: 'Most parents learn the baby\'s sex during the anatomy ultrasound at 18-22 weeks. Some genetic tests (NIPT) can determine sex as early as 10 weeks, though these are optional screenings.'
      },
      {
        question: 'What is considered full term for pregnancy?',
        answer: 'Full term is 37-42 weeks. Early term is 37-38 weeks, full term is 39-40 weeks, late term is 41 weeks, and post-term is 42+ weeks. Each week matters for baby\'s development.'
      },
      {
        question: 'How is my due date calculated if I don\'t know my last period?',
        answer: 'If you don\'t know your LMP or have irregular cycles, your doctor will use an early ultrasound (typically at 8-13 weeks) to estimate your due date based on the baby\'s size.'
      }
    ],
    '/bmi-calculator': [
      {
        question: 'What is a healthy BMI range?',
        answer: 'For most adults, a BMI of 18.5-24.9 is considered healthy, 25-29.9 is overweight, and 30+ is obese. However, BMI doesn\'t account for muscle mass, bone density, or body composition, so it\'s just one health indicator.'
      },
      {
        question: 'Is BMI accurate for everyone?',
        answer: 'No. BMI is less accurate for athletes (who have high muscle mass), elderly people (who have less muscle), and certain ethnicities. Asian populations use different cutoffs (18.5-22.9 for healthy weight).'
      },
      {
        question: 'What should I do if my BMI is too high?',
        answer: 'Talk to your doctor first. Even a 5-10% reduction in body weight can significantly improve health. Focus on sustainable changes: more movement, better food choices, adequate sleep, and stress management.'
      },
      {
        question: 'How much should I weigh for my height?',
        answer: 'A healthy weight varies based on many factors. For example, at 5\'9": 125-168 lbs is "healthy" by BMI. But muscle mass, bone structure, and body composition matter more than a single number on the scale.'
      },
      {
        question: 'Can BMI be too low?',
        answer: 'Yes. A BMI under 18.5 is considered underweight and carries health risks including weakened immune system, osteoporosis, and fertility issues. If your BMI is low, consult a healthcare provider.'
      }
    ],
    '/discount-calculator': [
      {
        question: 'How do I calculate percentage off?',
        answer: 'To calculate a discount: multiply the original price by the discount percentage (as a decimal), then subtract from the original price. For example, 25% off $100: $100 × 0.25 = $25 discount, final price = $75.'
      },
      {
        question: 'Can I stack multiple discounts?',
        answer: 'It depends on the store. Some allow stacking a manufacturer coupon + store coupon + sale price. Others apply discounts sequentially (20% off, then 10% off remaining, not 30% total). Always read the fine print.'
      },
      {
        question: 'What is a good discount percentage?',
        answer: '30% or more is typically a real sale. 40-50% off is a great deal. 60%+ is clearance. Anything less than 20% might not be better than regular prices at competitors. Always compare actual final prices.'
      },
      {
        question: 'Are "original price" discounts real?',
        answer: 'Not always. Some retailers inflate "original" prices to make discounts look better. If something is "always on sale," the sale price is probably the real price. Research typical prices before buying.'
      }
    ],
    '/age-calculator': [
      {
        question: 'How do I calculate my exact age?',
        answer: 'Calculate the difference between today\'s date and your birthdate, accounting for whether your birthday has occurred this year. Our calculator gives your age in years, months, days, and even hours.'
      },
      {
        question: 'Why calculate age in days or hours?',
        answer: 'Age in days is useful for tracking infant development, habit formation (66 days to form a habit), or counting down to milestones. Some people celebrate 10,000-day birthdays or similar markers.'
      },
      {
        question: 'How does age affect insurance rates?',
        answer: 'Car insurance typically drops at age 25. Life insurance gets more expensive with age. Health insurance can\'t charge based on age except in specific ways under the ACA. Knowing your exact age helps with rate calculations.'
      },
      {
        question: 'What is my age in different calendar systems?',
        answer: 'Different cultures calculate age differently. In Korea, everyone is 1 year old at birth and ages up on New Year\'s Day (not birthdays). This calculator uses the Western system of age calculation.'
      }
    ],
    '/split-bill-calculator': [
      {
        question: 'Should we split the bill equally or by what we ordered?',
        answer: 'Equal splits work when everyone ordered similarly priced items. Itemized splits are fairer when there\'s a big difference (someone ordered apps and drinks, others had water and an entree). Communicate beforehand.'
      },
      {
        question: 'Do I include tip when splitting the bill?',
        answer: 'Yes, always include tip in the total before splitting. Calculate the tip on the full bill, add it to the total, then divide. If you split first, the person paying may end up covering the full tip.'
      },
      {
        question: 'How do I split bills with different payment methods?',
        answer: 'One person pays the full bill on their card, then others send their share via Venmo, Zelle, or Cash App. Alternatively, ask the server to split the check beforehand (though large groups may face a split limit).'
      },
      {
        question: 'What if someone can\'t pay their share right away?',
        answer: 'Be clear about expectations before dining. If someone genuinely can\'t afford it, decide as a group if you\'ll cover them. For regular occurrences, this person should order more modestly or decline expensive outings.'
      }
    ],
    '/unit-converter': [
      {
        question: 'How many tablespoons are in a cup?',
        answer: '16 tablespoons = 1 cup. This is one of the most common kitchen conversions. Also useful: 3 teaspoons = 1 tablespoon, 4 cups = 1 quart, 2 cups = 1 pint.'
      },
      {
        question: 'Should I measure by weight or volume for baking?',
        answer: 'Weight (grams/ounces) is more accurate for baking. A cup of flour can vary by 25% depending on how you scoop it. Professional bakers use kitchen scales and measure in grams.'
      },
      {
        question: 'How do I convert Celsius to Fahrenheit quickly?',
        answer: 'Quick estimate: multiply Celsius by 2, then add 30. (20°C × 2 + 30 = 70°F, actual is 68°F). Exact formula: (°C × 9/5) + 32 = °F. For negative temps, the quick method is less accurate.'
      },
      {
        question: 'What does "metric cup" mean in recipes?',
        answer: 'A US cup is 236.6 mL, but a metric cup (used in Australia, New Zealand, Canada) is 250 mL. Most recipes adapt fine, but for precision baking, note which standard is used.'
      },
      {
        question: 'How many grams is a stick of butter?',
        answer: 'One US stick of butter is 113 grams (4 ounces). It equals ½ cup or 8 tablespoons. The wrapper has tablespoon markings for easy measuring.'
      }
    ]
  };

  return faqs[toolPath] || [];
}

/**
 * Get FAQ schema markup for SEO
 */
export function getFAQSchema(toolPath: string): object | null {
  const faqs = getFAQs(toolPath);
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}
