export const parseExtractedText = (text) => {
    if (!text) return null;

    // Split by newlines and clean up empty lines
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length < 5) {
        return {
            error: "Not enough information extracted to form a complete question with 4 options.",
            rawText: text
        };
    }

    // Attempt to identify the question and the options
    // This is a naive heuristic: Assuming the first sentence/block is the question,
    // and the subsequent lines are options (A, B, C, D or 1, 2, 3, 4 etc.)

    let questionText = lines[0];
    let options = [];

    // Try to find options starting with A), B), 1., etc.
    const optionRegex = /^([A-D]|[1-4])[\.\)]?\s*(.*)/i;

    let currentOption = '';
    for (let i = 1; i < lines.length; i++) {
        const match = lines[i].match(optionRegex);
        if (match) {
            if (currentOption) {
                options.push(currentOption);
            }
            currentOption = match[2]; // The rest of the string after A)
        } else {
            // If it doesn't look like a new option, append it to the current running string
            if (options.length === 0) {
                // Still part of the question text
                questionText += ' ' + lines[i];
            } else {
                // Part of the current option
                currentOption += ' ' + lines[i];
            }
        }
    }

    // Push the last option
    if (currentOption) {
        options.push(currentOption);
    }

    // Fallback: if regex didn't work beautifully, just take the first line as question
    // and the next 4 non-empty lines as options.
    if (options.length < 2) {
        options = lines.slice(1, 5);
    }

    // Ensure we have exactly 4 options to fit our UI model. Pad with empty strings if needed.
    while (options.length < 4) {
        options.push('');
    }

    // Trim options to max 4 (we only support 4 based on user request)
    if (options.length > 4) {
        const extraOptions = options.slice(4).join(' | ');
        // You could optionally append extra text back to the last option or discard.
        // We'll just slice it to 4 for strictness.
        options = options.slice(0, 4);
    }

    return {
        questionText,
        options,
        rawText: text
    };
};
