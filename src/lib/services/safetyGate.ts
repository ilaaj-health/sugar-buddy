import { DOSING_KEYWORDS, DANGER_SYMPTOMS, ESCALATION_MESSAGES, GLUCOSE_THRESHOLDS } from '@/lib/config/safety';

export function checkUserInputSafety(message: string): { fixedResponse: string | null } {
  const lower = message.toLowerCase();

  for (const kw of DOSING_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        fixedResponse: 'Yeh faisla sirf aapka doctor kar sakta hai. Main insulin ya dawai ke doses ke baare mein mashwarah nahi de sakta.\n\nYaad rakhein: Yeh tibbi mashwarah nahi hai — apne doctor se zaroor mashwarah karein.',
      };
    }
  }

  for (const symptom of DANGER_SYMPTOMS) {
    if (lower.includes(symptom)) {
      return {
        fixedResponse: 'Yeh khatarnaak alaamaat ho sakti hain! Fori taur par doctor se raabta karein ya hospital jayein.\n\nYaad rakhein: Yeh tibbi mashwarah nahi hai — apne doctor se zaroor mashwarah karein.',
      };
    }
  }

  return { fixedResponse: null };
}

export function processAIOutput(text: string): string {
  let safe = text;

  for (const kw of DOSING_KEYWORDS) {
    if (safe.toLowerCase().includes(kw)) {
      safe += '\n\nYaad rakhein: Dawai ya insulin ke doses ke baare mein sirf aapka doctor faisla kar sakta hai.';
      break;
    }
  }

  if (!safe.includes('tibbi mashwarah nahi') && !safe.includes('not medical advice')) {
    safe += '\n\nYaad rakhein: Yeh tibbi mashwarah nahi hai — apne doctor se zaroor mashwarah karein.';
  }

  return safe;
}

export function checkEscalation(value: number): { shouldEscalate: boolean; reason: string } | null {
  if (value < GLUCOSE_THRESHOLDS.DANGER_LOW) {
    return { shouldEscalate: true, reason: ESCALATION_MESSAGES.LOW.romanUrdu + '\n\n' + ESCALATION_MESSAGES.LOW.english };
  }
  if (value > GLUCOSE_THRESHOLDS.DANGER_HIGH) {
    return { shouldEscalate: true, reason: ESCALATION_MESSAGES.HIGH.romanUrdu + '\n\n' + ESCALATION_MESSAGES.HIGH.english };
  }
  return null;
}
