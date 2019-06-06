# Navigation Lifecycle

With the addition of guard middleware, the navigation lifecycle has changed. It will now be as follows:

![Lifeycle flowchart](/docs/img/lifecycle.png)

1. Start on _Page A_.

2. Navigation initiated. _The loading page is shown._

3. Check if any guards are left in the chain.

   - If no guards are left, skip to step 5.

   - If there are guards left, continue to step 4.

4. Run the first guard in the queue:

   - `next()`: Return to step 3.

   - `next.props()`: Add the props to the render of _Page B_, and return to step 3.

   - `next.redirect()`: Redirect to given location, and restart at step 1.

   - `Error`: Navigation has been prevented. _The error page is shown._

5. Navigation was successful! _Page B is shown._
