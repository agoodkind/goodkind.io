---
layout: post
title: American Opioid Crisis through the lens of Data Science
categories: [data science, python, computer science, tech, opioid epidemic, software engineering]
---

> **Between 2012 and 2016 the number of overdoses for every 100,000th person went
> from 8 to 12 causing for an epidemic to be declared on a national level**

<style>

.gif-plot { 
    display: none;
}

@media only screen and (max-width: 800px)  {

    .live-plot {
        display: none;
    }

    .gif-plot {
        display: unset;
    }
    
}
</style>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<div id="7e8fadb3-8c24-415a-805e-1dc19d379da6" style="height: 100%; width: 100%;" class="plotly-graph-div live-plot"></div>
<script src="/assets/js/usa_heatmap.js"></script>

<img class="gif-plot" src="/assets/img/datascience.gif">

Data science is about telling a story through data. My approach to this very
topic was optimistic, I wanted to take my existing knowledge of computer science
and learn about data science while also learning about a non-computer science
topic and set a goal of communicating the information I learned about this topic
through a visual story (data visualization).

*****

> Part 1: **“find a dataset"**

Dataset I chose was the Opioid Overdose Death Rate in America between 1999–2016.
I wanted to use this because I grew up in a family where there wasn't a lot of a
engineers, or tech minds at all. My mom and her mom were both nurses, so I never
was exposed to technology, and everything I know has been self taught. However a
big part of my life has been knowing a lot about how hospitals and insurance
works, especially how opioid prescriptions work and how heavily prescribed they
are. My mom is plagued with chronic arthritis and back problems and as a nurse
will purposefully take 1/4 of the prescribed amount of medicine because she has
seen what life changing effects the drugs does to people.

Now with a data set selected I was set on a mission to tell this story in a
meaningful and effective way. Knowing our dataset we need to seek out actual
data, for me the best place I could find was cdc.gov and NVSS (national center
for vital statistics). They have public available data on statewide and county
wide overdose rates on a per drug basis.

*****

> Part 2: **“clean the data"**

The dataset that was provided by wonder.cdc.gov was given a tab separated text
documented, conveniently pandas has an option that fixes that for us. 

{% highlight python %}
cdc_wonder_all = pd.read_csv('./Multiple Cause of Death, 1999–2016.txt', sep="\t")
{% endhighlight  %}

however, we had about 68 rows of unnecessary “footnotes" that was added by the
website, we can solve that easily by running:
{% highlight python %}
    cdc_wonder_all.drop((range(918, len(cdc_wonder_all)
                    )), inplace=True)
{% endhighlight  %}

we also had a notes column that contained gibberish, we can do a similar
operation to rid it:
{% highlight python %}
    cdc_wonder_all = cdc_wonder_all.drop(columns="Notes")
{% endhighlight  %}
now we can save the result for use in Plotly
{% highlight python %}
    cdc_wonder_all.to_csv("./csv's from jupyter/cdc_for_plotly.csv")
{% endhighlight  %}
*****

> Part 3: **“feel the data"**

This is the final part but also the longest and most difficult part as it
requires the most work.

I elected to use Pandas as the tool to manipulate the data
[Plotly](https://plot.ly/) as my main visualization tool because it easily
allows exporting to HTML/JS documents.

Because I am not using Plotly cloud I need to instantiate my environment in
offline mode so I can export my data instead of using their online graphing
tools. This can be done a couple different ways, the way I did it was:
{% highlight python %}
    from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
    init_notebook_mode(connected=False)
    import plotly.graph_objs as go
    from plotly.graph_objs import *
{% endhighlight  %}
Next I imported my previously edited dataset 
{% highlight python %}
    df_wonder_all = pd.read_csv("./csv's from jupyter/cdc_for_plotly.csv")
{% endhighlight  %}
I also set up a hash dictionary of state 2 letter codes to state names and put
them in the dataset:
{% highlight python %}
    state_hash_codes = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'American Samoa': 'AS',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Commonwealth of the Northern Mariana Islands': 'MP',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'District of Columbia': 'DC',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Guam': 'GU',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Puerto Rico': '',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'United States Virgin Islands': 'VI',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    }

    state_letters_array = [] # empty array for storage

    for i in df_wonder_all["State"]: 
        state_letters_array.append(state_hash_codes[i]) # this will be useful for later when plotting

    df_wonder_all["State Code"] = state_letters_array
{% endhighlight  %}
These next few lines are declaring our axises and data points:
{% highlight python %}
    # data point, declared in previous line
    state_codes = df_wonder_all["State Code"].unique().tolist()

    # each frame in our eventual animation is based on thisyear = df_wonder_all["Year"].unique().tolist()
{% endhighlight  %}
We now need to recalculate the crude rate given to use by the CDC as they do not
include numbers below 8 (considering them insignificant, however in our dataset
they still are) and then insert a text row for each column that will eventually
correspond to a hover with some general information:
{% highlight python %}
    df_wonder_all['Crude Rate'] = (df_wonder_all['Deaths'] / df_wonder_all['Population'] * 100000).round()

    df_wonder_all["Text"] = df_wonder_all['State'] + '<br>' + \
        'Total Deaths: ' + df_wonder_all['Deaths'].astype(str) + '<br>' + \
        'Population: ' + df_wonder_all['Population'].astype(str) + '<br>' + \
        'Death Rate Per 100,000: ' + df_wonder_all['Crude Rate'].astype(str) + '<br>'
{% endhighlight  %}
This next part is where we need to start thinking about how our data is going to
look, we need to create a new data frame that represents a flattened version of
the original. Almost as if each row is a year which corresponds to a dictionary
of states which corresponds to their respective crude rates (rate/100,000 rate).


The way we deduce this is because in the end we want a frame animation that is
based on the years 1999, 2000, 2001, …, 2016, and each year will contain the
same set of states, AL, AK, …, WY, which contain their respective crude rates.

Therefore we need to make our data frame represent this.

Long story short the way we do this in pandas is through the following lines of
code:
{% highlight python %}
    df_flat = df_wonder_all.groupby(by=["Year","State","State Code", "Text"]).sum()
{% endhighlight  %}
Where df_flat is our flattened data frame, and we are setting it equal to the
the original data frame being grouped by Year, State, and State Code, and Text.
At the end we are summing all other non-grouped values.

> Part 4: “**Constructing the visualization**"

The first thing we need to do is define our initial frame (z-axis) this will be
the year 1999
{% highlight python %}
    initial_frame = df_flat.loc[1999.0].reset_index()["Crude Rate"]
{% endhighlight  %}
now we can begin constructing all our other frames 
{% highlight python %}
    frames = [
        {
            "data": [
                {
                    "z": df_flat.loc[i]["Crude Rate"], 
                    "text": df_flat.loc[i].reset_index()["Text"], 
                    "type": "choropleth"
                }
            ],
            "traces": [0], # this just needs to be in here to make plotly happy, it can be used for other things such as trend lines but we arent using it for our purposes
            "name": str(int(i))       
        } 
    for i in year ] # this is where the year array was useful
{% endhighlight  %}
Now we can define our color range, a good tool I used for this can be found
[here](https://gka.github.io/palettes/#colors=lightyellow,orange,deeppink,darkred|steps=7|bez=1|coL=1)
(be sure to select 11)
{% highlight python %}
    colors = ['#ffffff','#ffe3e2','#ffc7c4','#fdaaa7','#f88e8b','#f17071','#e84e57','#dd1e3f','#bf0c2a','#9f0517','#800000']
    lcolors = len(colors)
    sc_ch = []
    for c in range(0, lcolors):
        sc_ch.append([c/10, colors[c]])
{% endhighlight  %}
Next we construct our main data dictionary, this just ties together the first
few things we defined and some titles:
{% highlight python %}
    data_ch = [dict(
        type = 'choropleth',
        colorscale = sc_ch,
        autocolorscale = False,
        locations = state_codes,
        z = initial_frame,
        zauto = False, 
        zmax = 66.1, # the maximum value any state can be (west virginia)
        zmin = 13.1, 
        locationmode = 'USA-states',
        text = df_wonder_all["Text"],
        marker = dict(
            line = dict(
                color = 'rgb(255,255,255)', # state lines, all white
                width = 2
            )),
        colorbar = dict(title = "Deaths per 100,000")
    )]
{% endhighlight  %}
Now we need to make our sliders, this is super important because it allows the
user-controllable slider bar to match with each frame:
{% highlight python %}
    sliders = [
        {
            'active': 0,
            'yanchor': 'top',
            'xanchor': 'left',
            'currentvalue': {
                'font': {'size': 20},
                'prefix': 'Year:',
                'visible': True,
                'xanchor': 'right'
            },
            'transition': {'duration': 300, 'easing': 'cubic-in-out'},
            'pad': {'b': 10, 't': 50},
            'len': 0.9,
            'x': 0.1,
            'y': 0,
            
        "steps" : [
                {
                    "method":'animate', 
                    "args":[
                        [i],
                        {
                            "mode":'immediate', 
                            "frame":
                            {
                                "duration":300,
                                "redraw":False
                            }, 
                            "transition":{"duration":300}}],
                    "label": str(int(i))
                } for i in year] # each slider will correspond to a year
        }
    ]
{% endhighlight  %}
The slider basically defines the transition effects and what frame will do what

Now the very last part is we must define the layout, which just defines some
logic for how the graph will look:
{% highlight python %}
    layout_ch = {
        "sliders": sliders, # insert our sliders here
        "updatemenus": [{
            "buttons": [{
                "args": [None, {
                    "frame": {
                        "duration": 500,
                        "redraw": False
                    },
                    "transition": {
                        "duration": 300,
                        "easing": "quadratic-in-out"
                    },
                    "fromcurrent": False
                }],
                "label": "Play",
                "method": "animate"
            }, {
                "args": [[None], {
                        "frame": {
                            "duration": 0,
                            "redraw": False
                        },
                        "transition": {
                            "duration": 0
                        },
                        "mode": "immediate"
                    }
                ],
                "label": "Pause",
                "method": "animate"
            }],
            'direction': 'left',
            'pad': {'r': 10, 't': 87},
            'showactive': False,
            'type': 'buttons',
            'x': 0.1,
            'xanchor': 'right',
            'y': 0,
            'yanchor': 'top'
        }],
        "title": 'Yearly Drug Overdose Death Rate since 1999', # the main title
        "geo": {
            "projection": dict(type = 'albers usa'), # this is the only option available 
            "showlakes": True,
            "lakecolor": 'rgb(255, 255, 255)',
        },
    }
{% endhighlight  %}
Now we can finally graph!
{% highlight python %}
    fig_ch = dict( data=data_ch, layout=layout_ch, frames=frames ) # create your main figure
    iplot( fig_ch, validate=False ) # plot directly in jupyter
    # or export to html document:
    plot( fig_ch, include_plotlyjs=True, filename='chloro_test.html' )
{% endhighlight  %}
Take a look here:

Take a look here:

[https://overdose.goodkind.io/cholor.html](https://overdose.goodkind.io/cholor.html)

Clone the repo and try it with a different dataset:

[https://github.com/agoodkind/opioid-overdose-epidemic](https://github.com/agoodkind/opioid-overdose-epidemic)

A take away from this whole ordeal is that data science and data analytics are
not just buzzwords, but are powerful tools, ways of processing data, that allows
us to collect, draw new conclusions, and convey new information on data in
fascinating, efficient, and interesting ways.

<br> 

<br> 
