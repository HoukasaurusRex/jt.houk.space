# A Practical Guide to Spending a Thousand Dollars a Day on AI

## Step One Costs Nothing (Emotionally)

Congratulations, your company has given you access to a frontier model LLM with architectural reasoning.
You dust off your shiny new API key, open a sparkly new chat window in your codebase and say "analyze this repository for me and tell me what you
find."

Looks like it found your wallet, and it knows how to use it.

You're feeling good. Feeling productive. The model maps your directory structure, reads your configuration files, forms opinions about your package
manager choices,
it even dusted the shelves and opened the window to freshen up the place. It produces a comprehensive architectural overview,
costing somewhere between an americano and pumpkin spice latte depending on repository size, that you skim for about forty-five seconds.
It sounds great,
really professional stuff. Good job.

You are now ready for step two.

## Oops, I Opus'd Everything

Opus will reframe your problem. It will refactor things you did not ask it to refactor. It will produce sweeping, elegant,
verbose solutions to problems that required a two-line fix.

You will use it for everything, because the first conversation was so impressive. It even complimented your use of ternaries.
Nobody's ever appreciated your use of ternaries before.'

Brainstorming a system design? Opus gives you three competing architectures with trade-off analyses. Converting a high-level plan into a detailed
execution spec? Opus can gab about that till Github's back online. Now the plan is done, and oh that container padding looks about a couple pixels off
on that button.
Opus is still in the room, so let it handle that for you - you deserve a well earned break after all that prompting.
No need to switch models, besides that's like going from first class back to coach halfway through the flight. Ew.

And thus Opus adjusts your padding. Thoughtfully. With careful consideration for your design system's spacing conventions. For four dollars.

"Could I have opened a new context window to handle this?" the thought blows into your mind like a cold breeze through an open window.
"Should I have used the most expensive model to nudge that div two pixels to the left?" you wonder ponderingly.
"Was it worth it?" you ponder wonderingly.

*Shh, quiet sweet child. Now's not the time to think critically. You've just produced two thousand lines of code before standup. That's productivity.
That's progress.*

*Oh, unrelated but..."*

## "Would You Please Figure Out Why My Code Is Broken While I Go Get a Coffee?"

Looks like your work has failed in CI. No problem - let your LLM figure it out, go get your oat milk latte. This is the future and the future handles
things
while you're gone.

The model reads the error. The model does not know what caused the error. But the model has initiative, the model has permissions,
and most importntly,
the model has no one around to tell it to hang on a minute what are you doing exactly?

*Thinking...*

*Well, that didn't work. Let me run the same command with --tail 100.*

*Considering...*

*Well, that didn't work. Let me run the same command with --head 100.*

*Yoloing...*

*Well, I didn't find what I'm looking for there. This time I'll consume the entire log output.*

*Spending...*

*Hmm, let me look through this node_modules folder...*

*Expensing...*

Oh you're back. You're model is still investigating, but rest assured it will not rest until it has looked through every file, read every log,
whirred every processor in Arizona to -
oh what's that? There's an internal tool you forgot to run first? Ah looks like that fixed it.

Every tool has its strengths. A search engine is best for finding documented issues,
a debugger for stepping through execution, and a language model for solving known issues with money.

## A Field Guide to Temperament

Each model responds to instruction differently, in the way that each child responds to discipline differently, which is to say:
what works on one will produce a meltdown in another.

Opus likes examples. Show it what you mean. Give it reference material and room to draw its own conclusions. It will find patterns you did not intend
to show it, and some of those patterns will be useful, and all of them will be expensive. When a task is genuinely ambiguous,
when a complex error lives at the intersection of three subsystems, that expense makes sense. The rest of the time you are paying Opus prices for
Sonnet work.

Sonnet likes rules. Give it explicit formatting instructions, clearly scoped tasks, defined boundaries. It will follow them. It will not surprise you.
This only sounds unremarkable until you've spent a week with one that doesn't.

Haiku gets a hammer and a small, sturdy box with one nail in it. You do not give Haiku ambiguous tasks. You do not give Haiku your repository.
You give Haiku a function signature and an expected output and you let it swing. It swings fast and it costs almost nothing and when it misses the
nail you throw the box away and hand it another one. Haiku is a toddler with a mallet in a room with one breakable thing.
God help whatever else is in there with it, but the nail will get hit.

The instinct is to start from the top. You have access to the most capable model, so you use it, because choosing a less capable one when a more
capable one exists feels like volunteering to be worse at your job. This is, of course, exactly the kind of reasoning that produces thousand-dollar
days. But it felt good, didn't it? Productive. Like upgrading to the premium tier of something. You earned this.

Start from the bottom. The cheapest thing that can do the work. You can always escalate. You rarely need to.

## The Cheapest Token Is the One You Didn't Need

Planning costs money. Real money. You will look at the invoice for an Opus planning session and think "I could have just started coding."

You could have. And then you would have started debugging. And then the debugging would have needed more context, so you'd paste in the whole file,
and the model would read all six hundred lines to understand the twelve that matter, and then it would suggest a fix that breaks something else,
and now you're two Opus sessions deep into a problem that a twenty-minute design conversation would have caught.

A plan that Opus writes and Sonnet executes costs a fraction of a plan that Opus writes and Opus executes and Opus debugs and Opus refactors
and Opus investigates the side effects of its own refactoring. You know that sentence got more expensive as you read it. So did the workflow.

Writing a script that calls an LLM API? Start from the cheapest model. Haiku's little box. Scale up when something specifically requires
more conceptual awareness, not when it merely feels like it deserves the premium treatment.

## The Skull and Crossbones Problem

You need an icon. Something simple. A skull and crossbones, say, for an error state. You could open a browser, find an SVG on any of the seventeen
free icon sites, and drop it into your project. Takes about twelve seconds.

Or you could ask the model.

The model will try. Bless it, the model will try so hard. It will produce SVG path data that looks like a skull drawn by someone who has
had a skull described to them over a bad phone connection. It will cost you two dollars. You will spend twenty minutes nudging bezier curves
before giving up, opening a browser, and downloading the free icon that a human drew. Total cost: two dollars and twenty minutes for the
privilege of learning what you already knew.

Now apply that to everything visual. The button that feels three pixels off at a certain breakpoint. The hover state that works but
feels wrong in a way you can't articulate to a system that doesn't have hands. The spacing that technically matches the spec but makes
your designer's eye twitch. These are problems that live in the gap between specification and perception, and models do not perceive.
They predict. Confidently. Expensively. Incorrectly.

Your model is a very fast, very literal contractor that bills by the syllable and never pushes back on a bad requirement. Unless you've specifically
instructed it to push back, at which point it pushes back on seven things, four of which were fine, and invoices you for the deliberation.

## Have You Tried Getting It Right the First Time?

Go run [`ccusage`](https://github.com/ryoppippi/ccusage). Right now. Pull up your actual spending. It's fine, we'll wait.

See that spike on Tuesday? That was the eleven-minute investigation that produced nothing. That plateau on Thursday afternoon was Opus
adjusting your container padding with the gravitas of a cathedral restoration. And that little blip at the end of the day? That was the skull.

The thousand-dollar day is not one catastrophic decision. It is the same small mistake, compounding. You picked the wrong model for a task,
so the output was wrong, so you asked it to fix the output, so it re-read the entire context to understand what it had done,
so it tried a different approach that was also wrong but longer, so you asked it to fix that, and somewhere around iteration six you are producing
errors at industrial scale and the model is requesting permission to read your test suite.

The fast, good, cheap triangle has not retired. It just started billing per million tokens.
