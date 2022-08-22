// const amqp = require('amqplib')
// const SMS_Controller = require('../Controllers/SMS_Controller')
// module.exports = class {
//     constructor(){
//         this.sms = new SMS_Controller()
//     }
//     Connect = async (QueName)=>{
//         try {
//             console.log('Connecting to Cloud RabbitMQ Server...')
//             const connection = await amqp.connect(process.env.AMQP_URL)
//             const channel = await connection.createChannel()
//             const results = await channel.assertQueue(QueName)
//             console.log('Queue connection successfull!')
//             return channel
//         } catch (ex) {
//             console.error('Connection Failed.\nRetrying...')
//             return 'error'
//         }
//     }

//     Publish = async (json_data, QueName)=>{
//         const channel = await this.Connect(QueName)
//         if(channel != "error"){
//             channel.sendToQueue(QueName, Buffer.from(JSON.stringify(json_data)))
//             console.log('Message successfully sent to '+QueName+' Queue!')
//             channel.close()
//         }else{
//             console.log('Failed to Publish Event to Queue: '+QueName)
//         } 
//     }
    
//     Consume = async (QueName)=>{
//         try{
//             const channel = await this.Connect(QueName)
//             console.log('Waiting for messages...')
//             channel.consume(QueName,data=>{
//                 console.log('Received Job!')
//                 this.sms.SendSMS(data.content.toString())
//                 .then(()=>{
//                     console.log('De-Queueing the Server...')
//                     channel.ack(data)
//                     console.log("Waiting for new messages...")
//                 }).catch(err=>{
//                     console.log(err)
//                     console.log('Event Maintained for later processing.')
//                 })
//             })
//         }catch(e){
//             console.log('Failed to Connect To RabbitMQ Server.\nRetrying...')
//         }finally{
//             this.Connect(QueName)
//         }
//     }
// }