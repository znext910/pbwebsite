from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

FAQS = [
    (["menu", "food", "dish", "price"], 
     "Our menu section showcases food categories. Contact the restaurant for the current menu and prices."),
    (["timing", "hours", "open", "closed"],
     "Please contact Pali Bhavan to confirm today's opening hours."),
    (["location", "address", "where", "direction"],
     "Find Pali Bhavan, Mumbai on Google Maps for directions."),
    (["reservation", "booking", "book", "table"],
     "Please contact the restaurant directly to confirm table availability."),
    (["delivery", "takeaway", "takeout"],
     "Please contact the restaurant to confirm delivery and takeaway options."),
    (["contact", "phone", "number", "call"],
     "Search Pali Bhavan Mumbai on Google Maps for listed contact details."),
    (["hello", "hi", "hey", "namaste"],
     "Welcome to Pali Bhavan! Would you like to know about our menu, timings, location, or reservations?"),
    (["thank", "thanks"],
     "You're welcome! How else can I help?")
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").lower().strip()

    if not message:
        return jsonify({"reply": "Please enter a question."})

    words = message.replace("?", "").replace("!", "").replace(".", "").split()

    for keywords, answer in FAQS:
        if any(keyword in words for keyword in keywords):
            return jsonify({"reply": answer})

    return jsonify({
        "reply": "I can help with our menu, timings, location, reservations, and delivery."
    })

if __name__ == "__main__":
    app.run(debug=True)