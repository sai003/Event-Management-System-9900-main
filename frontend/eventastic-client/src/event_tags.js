const eventCategories = ["Music", "Business", "Food & Drink", "Community", "Arts", "Film & Media", 
                        "Sports & Fitness", "Health", "Science & Tech", "Travel & Outdoor", "Charity & Causes",
                        "Spirituality", "Family & Education", "Seasonal", "Government", "Fashion", "Home & Lifestyle", 
                        "Auto, Boat & Air", "Hobbies", "School Activities"]


const eventTagsByCategory = [
    {
        "cat_name": "Music",
        "tags": [ 
            { "tag_name": "Alternative"},
            { "tag_name": "Blues & Jazz"},
            { "tag_name": "Classical"},
            { "tag_name": "Country"},
            { "tag_name": "Cultural"},
            { "tag_name": "EDM / Electronic"},
            { "tag_name": "Folk"},
            { "tag_name": "Hip Hop / Rap"},
            { "tag_name": "Indie"},
            { "tag_name": "Latin"},
            { "tag_name": "Metal"},
            { "tag_name": "Opera"},
            { "tag_name": "Pop"},
            { "tag_name": "R & B"},
            { "tag_name": "Reggae"},
            { "tag_name": "Religious / Spiritual"},
            { "tag_name": "Rock"},
            { "tag_name": "Top 40"},
            { "tag_name": "Acoustic"},
            { "tag_name": "Americana"},
            { "tag_name": "Bluegrass"},
            { "tag_name": "Blues"},
            { "tag_name": "DJ / Dance"},
            { "tag_name": "EDM"},
            { "tag_name": "Electronic"},
            { "tag_name": "Experimental"},
            { "tag_name": "Jazz"},
            { "tag_name": "Psychedelic"},
            { "tag_name": "Punk / Hardcore"},
            { "tag_name": "Singer / Songwriter"},
            { "tag_name": "World"},
            { "tag_name": "Other Music"}
        ] 
   },
    {
        "cat_name": "Business", 
        "tags": [
            { "tag_name": "Startups & Small Business"},
            { "tag_name": "Finance"},
            { "tag_name": "Environment & Sustainability"},
            { "tag_name": "Educators"},
            { "tag_name": "Real Estate"},
            { "tag_name": "Non Profit & NGOs"},
            { "tag_name": "Sales & Marketing"},
            { "tag_name": "Media"},
            { "tag_name": "Career"},
            { "tag_name": "Investment"},
            { "tag_name": "Other Business"} 
        ] 
   },
    {
        "cat_name": "Food & Drink", 
        "tags": [
            { "tag_name": "Beer"},
            { "tag_name": "Wine"},
            { "tag_name": "Food"},
            { "tag_name": "Spirits"},
            { "tag_name": "Other Food & Drink"}
        ]
    },
    {
        "cat_name": "Community", 
        "tags": [
            { "tag_name": "State"},
            { "tag_name": "County"},
            { "tag_name": "City / Town"},
            { "tag_name": "LGBT"},
            { "tag_name": "Medieval"},
            { "tag_name": "Renaissance"},
            { "tag_name": "Heritage"},
            { "tag_name": "Nationality"},
            { "tag_name": "Language"},
            { "tag_name": "Historic"},
            { "tag_name": "Other Community"}
        ]
    },
    {
        "cat_name": "Arts", 
        "tags": [
            { "tag_name": "Theatre"},
            { "tag_name": "Musical"},
            { "tag_name": "Ballet"},
            { "tag_name": "Dance"},
            { "tag_name": "Opera"},
            { "tag_name": "Orchestra"},
            { "tag_name": "Craft"},
            { "tag_name": "Fine Art"},
            { "tag_name": "Literary Arts"},
            { "tag_name": "Comedy"},
            { "tag_name": "Sculpture"},
            { "tag_name": "Painting"},
            { "tag_name": "Design"},
            { "tag_name": "Jewelry"},
            { "tag_name": "Other Arts"}
        ]
    },
    {
        "cat_name": "Film & Media", 
        "tags": [
            { "tag_name": "TV"},
            { "tag_name": "Film"},
            { "tag_name": "Anime"},
            { "tag_name": "Gaming"},
            { "tag_name": "Comics"},
            { "tag_name": "Adult"},
            { "tag_name": "Comedy"},
            { "tag_name": "Other Film & Media"}
        ]
    },
    {
        "cat_name": "Sports & Fitness", 
        "tags": [
            { "tag_name": "Running"},
            { "tag_name": "Walking"},
            { "tag_name": "Cycling"},
            { "tag_name": "Mountain Biking"},
            { "tag_name": "Obstacles"},
            { "tag_name": "Basketball"},
            { "tag_name": "American Football"},
            { "tag_name": "Baseball"},
            { "tag_name": "Football"},
            { "tag_name": "Golf"},
            { "tag_name": "Volleyball"},
            { "tag_name": "Tennis"},
            { "tag_name": "Swimming & Water Sports"},
            { "tag_name": "Hockey"},
            { "tag_name": "Motorsports"},
            { "tag_name": "Fighting & Martial Arts"},
            { "tag_name": "Snow Sports"},
            { "tag_name": "Rugby"},
            { "tag_name": "Yoga"},
            { "tag_name": "Exercise"},
            { "tag_name": "Softball"},
            { "tag_name": "Wrestling"},
            { "tag_name": "Lacrosse"},
            { "tag_name": "Cheer"},
            { "tag_name": "Camps"},
            { "tag_name": "Weightlifting"},
            { "tag_name": "Track & Field"},
            { "tag_name": "Other Sports & Fitness"}
        ]
    },
    {
        "cat_name": "Health", 
        "tags": [
            { "tag_name": "Personal health"},
            { "tag_name": "Mental health"},
            { "tag_name": "Medical"},
            { "tag_name": "Spa"},
            { "tag_name": "Yoga"},
            { "tag_name": "Other Health"}
        ]
    },
    {
        "cat_name": "Science & Tech", 
        "tags": [
            { "tag_name": "Medicine"},
            { "tag_name": "Science"},
            { "tag_name": "Biotech"},
            { "tag_name": "High Tech"},
            { "tag_name": "Mobile"},
            { "tag_name": "Social Media"},
            { "tag_name": "Robotics"},
            { "tag_name": "Other Science & Tech"}
        ]
    },
    {
        "cat_name": "Travel & Outdoor", 
        "tags": [
            { "tag_name": "Hiking"},
            { "tag_name": "Rafting"},
            { "tag_name": "Kayaking"},
            { "tag_name": "Canoeing"},
            { "tag_name": "Climbing"},
            { "tag_name": "Travel"},
            { "tag_name": "Other Travel & Outdoor"}
        ]
    },
    {
        "cat_name": "Charity & Causes", 
        "tags": [
            { "tag_name": "Animal Welfare"},
            { "tag_name": "Environment"},
            { "tag_name": "Healthcare"},
            { "tag_name": "Human Rights"},
            { "tag_name": "International Aid"},
            { "tag_name": "Poverty"},
            { "tag_name": "Disaster Relief"},
            { "tag_name": "Education"},
            { "tag_name": "Other Charity & Causes"}
        ]
    },
    {
        "cat_name": "Spirituality", 
        "tags": [
            { "tag_name": "Christianity"},
            { "tag_name": "Judaism"},
            { "tag_name": "Islam"},
            { "tag_name": "Mormonism"},
            { "tag_name": "Buddhism"},
            { "tag_name": "Sikhism"},
            { "tag_name": "Eastern Religion"},
            { "tag_name": "Mysticism and Occult"},
            { "tag_name": "New Age"},
            { "tag_name": "Atheism"},
            { "tag_name": "Agnosticism"},
            { "tag_name": "Unaffiliated"},
            { "tag_name": "Hinduism"},
            { "tag_name": "Folk Religions"},
            { "tag_name": "Shintoism"},
            { "tag_name": "Other Spirituality"}
        ]
    },
    {
        "cat_name": "Family & Education", 
        "tags": [
            { "tag_name": "Education"},
            { "tag_name": "Alumni"},
            { "tag_name": "Parenting"},
            { "tag_name": "Baby"},
            { "tag_name": "Children & Youth "},
            { "tag_name": "Parents Association"},
            { "tag_name": "Reunion"},
            { "tag_name": "Senior Citizen"},
            { "tag_name": "Other Family & Education"}
        ]
    },
    {
        "cat_name": "Seasonal", 
        "tags": [
            { "tag_name": "St Patricks Day"},
            { "tag_name": "Easter"},
            { "tag_name": "Independence Day"},
            { "tag_name": "Halloween / Haunt"},
            { "tag_name": "Thanksgiving"},
            { "tag_name": "Christmas"},
            { "tag_name": "Channukah"},
            { "tag_name": "Autmun events"},
            { "tag_name": "New Year's Eve"}, 
            { "tag_name": "Other Seasonal"} 
        ]
    },
    {
        "cat_name": "Government", 
        "tags": [
            { "tag_name": "Republican Party"},
            { "tag_name": "Democratic Party"},
            { "tag_name": "Other Party"},
            { "tag_name": "Non - partisan"},
            { "tag_name": "Federal Government"},
            { "tag_name": "State Government"},
            { "tag_name": "County / Municipal Government"},
            { "tag_name": "Military"},
            { "tag_name": "International Affairs"},
            { "tag_name": "National Security"},
            { "tag_name": "Other Government"}
        ]
    },
    {
        "cat_name": "Fashion", 
        "tags": [
            { "tag_name": "Fashion"},
            { "tag_name": "Accessories"},
            { "tag_name": "Bridal"},
            { "tag_name": "Beauty"},
            { "tag_name": "Other Fashion"}
        ]
    },
    {
        "cat_name": "Home & Lifestyle", 
        "tags": [
            { "tag_name": "Dating"},
            { "tag_name": "Pets & Animals"},
            { "tag_name": "Home & Garden"},
            { "tag_name": "Other Home & Lifestyle"}
        ]
    },
    {
        "cat_name": "Auto, Boat & Air", 
        "tags": [
            { "tag_name": "Auto"},
            { "tag_name": "Motorcycle"},
            { "tag_name": "Boat"},
            { "tag_name": "Air"},
            { "tag_name": "Other Auto, Boat & Air"}
        ]
    },
    {
        "cat_name": "Hobbies", 
        "tags": [
            { "tag_name": "Anime / Comics"},
            { "tag_name": "Gaming"},
            { "tag_name": "DIY"},
            { "tag_name": "Photography"},
            { "tag_name": "Knitting"},
            { "tag_name": "Books"},
            { "tag_name": "Adult"},
            { "tag_name": "Drawing & Painting"},
            { "tag_name": "Other Hobbies"}
        ]
    },
    {
        "cat_name": "School Activities", 
        "tags": [
            { "tag_name": "Dinner"},
            { "tag_name": "Fund Raiser"},
            { "tag_name": "Raffle"},
            { "tag_name": "After School Care"},
            { "tag_name": "Parking"},
            { "tag_name": "Public Speaker"},
            { "tag_name": "Other School Activities"}
        ]
    }
]

export default {eventTagsByCategory, eventCategories};