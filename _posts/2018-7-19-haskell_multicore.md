---
layout: post
title: Haskell Multithreading
categories: [computer science, haskell, tech, software engineering]
---

After learning about functional languages, specifically Haskell, and their advantages in my such as the ability to multithread and parallel process my curiosity was peaked. 

We had only learned about these constructs in theory but I wanted to see this in real application.

This lead to recreate the classical data structures program of the recursive factorial generator in Haskell.

{% highlight haskell %}
main = print (fac 1000)

fac :: Integer -> Integer  -- return type
fac 0 = 1 --
fac n | n > 0 = n * fac (n-1) -- n * fac (n-1) recursive call
--  "| n > 0" is a conditional for the pattern "n" (base case)
{% endhighlight %}

We can compile this program by using the tools available with the command line program GHC and GHCi

{% highlight bash %}
ghc -c -threaded factorial.hs
{% endhighlight %}

Where `-c` means compile and `-threaded` means it will run the process in parallel

and opening in the interactive shell:

{% highlight bash %}
ghci factorial.hs +RTS -N
{% endhighlight %}

Where `+RTS` means beginning of run time system options
`-N` means number of threads/cores to run in parallel



*Edit:* I realized that it mightve not be a performance gain at all and my system just acting weird and prioritizing things because in theory I don't know if you actually make a factorial tree parallel due to the fact that you need to calculate `10 * 9` before you calculate `(10 * 9) * 8` and so on and so fourth

However my second hypothesis is that it is simply runnin the entire process across multithreads instead of using the recusrion tree across different threads (which would be 8x faster however would not be possible due to how math the works in this function) but there can be a way to precalculate base numbers and run iterations backwards to get this desired effect [stackoverflow.com/questions/34978236/parallelizing-factorial-calculation](https://stackoverflow.com/questions/34978236/parallelizing-factorial-calculation)

Lets take a look at the perfomance differences between 1 thread vs. 8 threads:

We are looking to see if the user time has increased. If the user time is greater than the elapsed time, then the program used more than one CPU.

`N=1`

![n1](/docs/haskelln1.png)

`N=8`

![n1](/docs/haskelln8.png)

In the video we are looking to see which execution time is faster:

<video autoplay style="width:100%" src="/docs/haskell.mp4">Your browser does not support HTML5 video</video>


In conclusion it seems that it is using more CPU cores (as depicted in both screenshots and the video), however is that speeding up the recursion by 8x, its hard to say.


References: 
- [stackoverflow.com/questions/34978236/parallelizing-factorial-calculation](https://stackoverflow.com/questions/34978236/parallelizing-factorial-calculation)
- [downloads.haskell.org/~ghc/latest/docs/html/users_guide/using-concurrent.html#using-smp-parallelism](https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/using-concurrent.html#using-smp-parallelism)