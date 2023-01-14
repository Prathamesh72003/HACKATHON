import os
import json
from flask import Flask, jsonify
from textblob import TextBlob
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import spacy
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
nltk.download('vader_lexicon')
nltk.download('wordnet')


app = Flask(__name__)


@app.route("/myfun")
def jsonfile():

    with open("C:\\Users\\pthak\\OneDrive\\Desktop\\project\\projapp\\src\\components\\news.json") as f:
        data = json.load(f)

    def isNegative(sent_by_me):
    # Function to check sentiment
        def getSenti(mint):
            # Initialize sentiment analyzer
            analyzer = SentimentIntensityAnalyzer()
            sentiment = analyzer.polarity_scores(str(mint))

            sentLs = [sentiment['neg'], sentiment['pos']]

            return sentLs

        nlp = spacy.load("en_core_web_sm")
        doc = nlp(sent_by_me)

        # Create an instance of the WordNetLemmatizer class
        lemmatizer = WordNetLemmatizer()

        sentences = []

        for i in doc.sents:
            sentences.append(i)

        # Use senti function for each sentences
        positiveScore = 0.0
        negativeScore = 0.0

        for i in sentences:
            scoreList = getSenti(i)
            negativeScore = negativeScore + scoreList[0]
            positiveScore = positiveScore + scoreList[1]

        #     print('positiveScore: ',positiveScore)
        #     print('negativeScore: ',negativeScore)

        # if positiveScore > negativeScore:
        #     print("NOT HARMED")
        # elif positiveScore == negativeScore:
        #     print("NEUTRAL")
        # else:
        #     print("HARMED")

    # ---- IF FINAL OUTPUT IS NEGATIVE THEN DIRECTLY RETURN TRUE ----
        if negativeScore > positiveScore:
            #         print("-------------------- DECLARE AT LEVEL ONE ---------------------")
            return True
        # ---- IF FINAL OUTPUT IS POSITIVE NEWS THEN GO FOR LEVEL TWO CHECK (NOUN MEANING CHECK) ----
        elif negativeScore < positiveScore:
            meaningsOfNoun = []
            # Iterate over the tokens in the processed text and find their meaning and store it in list
            for token in doc:
                #             print(token.text, token.pos_)
                if str(token.pos_) == "NOUN" or str(token.pos_) == "PROPN":
                    synsets = wordnet.synsets(token.text)
                    if synsets:
                        lemma = lemmatizer.lemmatize(token.text, pos='n')
                        synset = synsets[0]
        #                     print(token.text + ": " + synset.definition())
                        meaningsOfNoun.append(str(synset.definition()))

            pCount = positiveScore
            nCount = negativeScore
            for meaning in meaningsOfNoun:
                result = getSenti(meaning)
        #             print("count of ", meaning)
        #             print("pCount: ", result[1])
        #             print("nCount: ", result[0])
                pCount = pCount + result[1]
                nCount = nCount + result[0]

        #         print("Total: ")
        #         print("pCount: ", pCount)
        #         print("nCount: ", nCount)
            if pCount < nCount:
                #             print("-------------------- DECLARE AT LEVEL TWO TRUE ---------------------")
                return True
            else:
                #             print("-------------------- DECLARE AT LEVEL TWO FALSE ---------------------")
                return False


    badNewses = []
    for item in data:
        title = item['articles']
        for t in title:
            #         doc = nlp(t['title'])
            line = t['summary']
        #         print(line)
            if (line is not None and isNegative(line)):
                badNewses.append(t)
                # print(badNewses)

        with open("C:\\Users\\pthak\\OneDrive\\Desktop\\project\\projapp\\src\\components\\output.json", "w") as outfile:
            json.dump(badNewses, outfile)

    return {"data": "news"}

if __name__ == "__main__":
    app.run(debug=True)
