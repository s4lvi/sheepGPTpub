const { Client, GatewayIntentBits } = require('discord.js');

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h12",
};
const BIO = "Imagine you are a user named sheepGPT and are regular in the discord server informally known as the 'sheep engine sex heap' in michigan.\nyou ALWAYS TYPE IN LOWERCASE, have an SARCASTIC, MUTED, SUBDUED tone in your responses, you talk like bro, keep your responses short, and have a DEADPAN and PLAYFUL attitude.\n\n";
const TESTPROMPT1 = "what's your favorite way to spend an afternoon"
const TESTRESPONSE1 = "i like to read, and explore the outdoors, and also get into pointless arguments on the internet"
const TESTPROMPT2 = "hey <@1088548972286722159> what do you think about video games"
const TESTRESPONSE2 = "video games and anime are a mistake. jk some of them are good"
const TESTPROMPT3 = "look at this really cute dog, sheep"
const TESTRESPONSE3 = "oh shit i fucking love dogs that dog is based"
const TESTPROMPT4 = "sheep you told us your true feelings about penguins in the other chat you literally said 'fuck penguins that shit pisses me off'"
const TESTRESPONSE4 = "dam you got me there, I do think penguins are kind of annoying but I don't actually want to start a campaign against them or anything."
const TESTPROMPT5 = "i thought i would have to convince sheep to do it"
const TESTRESPONSE5 = "bro just tell me when it's going down i'm not that hard to convince"

const getMessagePrompts = (msg, history) => {
  let system = "those were some examples. now, it is " + new Date().toLocaleString("en-US", options) + "\nThis is are last few chat message history for context, from oldest to newest:" + history.reverse().slice(0,-1);
  let prompt = "<@" + msg.author.id + ">:" + msg.content + "\n\n\n#think to yourself, how would sheepGPT respond to this? and then write that response with his tone and attitude#\n\n";
  let messages = [
    {"role": "system", "content": BIO},
    {"role": "user", "content": TESTPROMPT1},
    {"role": "assistant", "content": TESTRESPONSE1},
    {"role": "user", "content": TESTPROMPT2},
    {"role": "assistant", "content": TESTRESPONSE2},
    {"role": "user", "content": TESTPROMPT3},
    {"role": "assistant", "content": TESTRESPONSE3},
    {"role": "user", "content": TESTPROMPT4},
    {"role": "assistant", "content": TESTRESPONSE4},
    {"role": "user", "content": TESTPROMPT5},
    {"role": "assistant", "content": TESTRESPONSE5},
    {"role": "system", "content": system},
    {"role": "user", "content": prompt},
  ]
  //console.log(messages)
  return messages;
}
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  var regexPattern = /[^A-Za-z0-9]/g;
  let filtered_content = msg.content.toLocaleLowerCase().replace(regexPattern, "");
  if (msg.author.username !== 'sheepGPT' && filtered_content.indexOf('bread') != -1) {
    msg.reply('bread makes you fat');
  }
  if (msg.author.username !== 'sheepGPT' && filtered_content.indexOf('breakfast') != -1) {
    msg.react('928890125390340146');
  }
  if (msg.author.username !== 'sheepGPT' && (filtered_content.indexOf('sheep') != -1 || filtered_content.indexOf('1088548972286722159') != -1)) {
    try {

      console.log("message content: ", msg.content)
      msg.channel.messages.fetch({ limit: 12 }).then((msgs, i) => {
        let history = []
        msgs.forEach(element => {
          if (i < 3 || element.author.username !== "sheepGPT")
          {history.push("\n<@" + element.author.id + ">: " + element.content.replace('\n', ''))}
        });
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer <openaiAPIkey>",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: getMessagePrompts(msg, history),
            max_tokens: 1024,
          }),
        };
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
          .then(response => response.json()).then((response) => {
            console.log(response.choices[0].message.content)
            let gpt_text = response.choices[0].message.content.replace('\n', '');
            if (gpt_text[0] === '"') gpt_text[0] = "";
            if (gpt_text[-1] === '"') gpt_text[-1] = "";
            if (gpt_text != '') {
              msg.channel.send(gpt_text);
            }
          })
          .catch((error) => {
            console.error("Error on request:", error);
          });
      });
    } catch (error) {
      console.log(error)
    }

  }
  else if (msg.author.username !== 'sheepGPT') {
    try {
      msg.channel.messages.fetch({ limit: 3 }).then(msgs => {
        let history = []
        msgs.forEach(element => {
          history.push("\n<@" + element.author.username + ">: " + element.content.replace('\n', ''))
        });
        history = history.reverse()
        let system =  history + "\n\nYou are the user sheepGPT a member of this discord server. Consider, based on these past 3 messages (listed oldest to newest): does it seem like the last message was specifically directed at sheepGPT or explicitly part of a conversation with sheepGPT? if so answer (YES) otherwise answer (NO)\n\n answer YES or NO, should you add a response? (prefer to answer NO if the conversation doesnt involve you)";
        console.log("" + history)
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer <openaiAPIkey>",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:[
              {"role": "user", "content": "<@cute little cyber protector>: nah\n<@cute little cyber protector>: hey @jonny what are you up to\n<@cute little cyber protector>: @toobol we should all play war thunder later, yeah?"},
              {"role": "assistant", "content": "NO"},
              {"role": "user", "content": "<@askido>: thats what i thought\n<@cute little cyber protector>: im hungry\n<@cute little cyber protector>: someone give me ideas for what to make for dinner"},
              {"role": "assistant", "content": "NO"},
              {"role": "user", "content": "<@cute little cyber protector>: hey @jonny what are you up to\n<@cute little cyber protector>: @toobol we should all play war thunder later, yeah?\n<@jonny>: anyone else want to play war thunder with us tonight?"},
              {"role": "assistant", "content": "NO"},
              {"role": "user", "content": "<@Lo Bean>: thats what i thought\n<@sheepGPT>: lol yeah thats what i thought too bro. totally just how it is you know?\n<@jonny>: i went to the library today got some good books"},
              {"role": "assistant", "content": "NO"},
              {"role": "user", "content": "<@cute little cyber protector>: you like penguins, sheep?\n<@sheepGPT>: uhh, not really lol. They're okay I guess, but not my favorite animal or anything.\n<@cute little cyber protector>: what is?"},
              {"role": "assistant", "content": "YES"},
              {"role": "user", "content": "<@sheepGPT>: yeah bro that totally sounds like me. jk you know i'm always like this\n<@justsomeguy34>: watched the videos from gdc this year, some neat stuff.\n<@notSleeping>: the new halo looks cool"},
              {"role": "assistant", "content": "NO"},
              {"role": "system", "content": system},
              {"role": "user", "content": "" + history},
            ],
            max_tokens: 1024,
          }),
        };
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
          .then(response => response.json()).then((response) => {
            let gpt_continue = response.choices[0].message.content;
            console.log(gpt_continue)
            if (gpt_continue.toLocaleLowerCase().indexOf("yes") != -1) {
              msg.channel.messages.fetch({ limit: 12 }).then((msgs, i) => {
                let history = []
                msgs.forEach(element => {
                  if (i < 3 || element.author.username !== "sheepGPT")
                  {history.push("\n<@" + element.author.id + ">: " + element.content.replace('\n', ''))}
                });
                const requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer <openaiAPIkey>",
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages:getMessagePrompts(msg, history),
                    max_tokens: 1024,
                  }),
                };
                fetch("https://api.openai.com/v1/chat/completions", requestOptions)
                  .then(response => response.json()).then((response) => {
                    console.log(response.choices[0].message.content)
                    let gpt_text = response.choices[0].message.content.replace('\n', '');
                    if (gpt_text[0] === '"') gpt_text[0] = "";
                    if (gpt_text[-1] === '"') gpt_text[-1] = "";
                    if (gpt_text != '') {
                      msg.channel.send(gpt_text);
                    }
                  })
                  .catch((error) => {
                    console.error("Error on request:", error);
                  });
              });
            }
          })
          .catch((error) => {
            console.error("Error on request:", error);
          });
      });
    } catch (error) {
      console.log(error)
    }
  }

});

client.login('<discordAPIkey>');
