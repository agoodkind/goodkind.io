---
layout: post
title: Detect Adblock on your Tumblelog (Tumblr)
published: false
---

1.) goto [tumblr.com/customize/](https://www.tumblr.com/customize/) & press "edit html"

2.) (copy &) paste the following right before ```</head>``` (CMD+F or CTRL+F to find ```</head>```)

{% highlight html %}
<script>var adsnotblocked=false</script>
<script type="text/javascript" src="http://static.tumblr.com/4ra4qv5/hZmnadqev/advertisement.js"></script>
{% endhighlight %}

3.) (copy &) paste the following right before ```</body>``` (CMD+F or CTRL+F to find ```</head>```)

{% highlight html %}
<div style="position:fixed;bottom:10px;left:10px;font-family:arial,verdana;font-size:16px;line-height:16px;width:150px;text-align:left;">
    <script>if (adsnotblocked!=true){
        document.write("I see you are blocking ads please unblock them to make me happy &lt;3");}
    </script>
</div>
{% endhighlight %}

4.) Now when someone blocks your ads you should see a box in the left hand bottom corner saying: 'I see you are blocking ads please unblock them to make me happy <3'
