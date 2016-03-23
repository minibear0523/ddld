var kue = require('kue');
var queue = kue.createQueue();
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtp://newsletter%40ddld.com.cn:DDLDbed2016@smtp.mxhichina.com');

/**
 * 队列对象的封装, 主要是给其他模块的函数使用
 */
var Queue = function() {
  return {
    queue: queue,
    addTask: addTask,
    processTask: processTask,
    getTaskStatus: getTaskStatus
  };
}

/**
 * 向队列中增加新的任务
 * @param emailAddress 需要发送邮件的地址
 * @param type 发送邮件的类型{'activation', 'newsletter'}
 */
var addTask = function (data, type) {
  var priority = (type == 'activation') ? 'high' : 'normal';
  var job = this.queue
              .create(type, {
                to: data.to,
                name: data.name,
                key: data.key
              })
              .priority(priority)
              .attempts(5)
              .save(function(err) {
                if (err) {
                  console.log(err);
                  return False;
                } else {
                  console.log(job.id); 
                  return job.id;
                }
              });

}

/**
 * 执行任务, 需要进行crontab调度
 */
var processTask = function (type) {
  this.queue.process(type, 20, function(job, done) {
    console.log(job.data.to, type);
    // 根据job.data.to和type发送邮件
    if (type == 'activation') {
      sendActivationEmail({
        to: job.data.to
      }, {
        name: job.data.name,
        key: job.data.key
      }, done);
    } else {
      sendNewsletterEmail({
        to: job.data.to
      }, {
        name: job.data.name
      }, done);
    }
  })
}

/**
 * 获取任务状态
 */
var getTaskStatus = function (jobId) {
  kue.Job.get(jobId, function(err, data) {
    if (err) {
      return err;
    } else {
      return data;
    }
  })
}

exports.createEmailQueue = Queue;

/**
 * 发送确认邮件模板
 */
var sendActivationEmail = transporter.templateSender({
  subject: "{{ name  }}请确认您的邮箱--大道隆达(北京)医药科技发展公司",
  text: "点击链接http://www.ddld.com.cn/newsletter/activate/{{ key }} 进行激活",
  html: "<a href='http://www.ddld.com.cn/newsletter/activate/{{ key }}>点击链接进行激活</a>",
}, {
  from: "newsletter@ddld.com.cn"
});

/**
 * 发送Newsletter
 */
var sendNewsletterEmail = transporter.templateSender({
  subject: "大道隆达{{ week }}订阅邮件",
  text: "",
  html: ""
}, {
  from: "newsletter@ddld.com.cn"
});

var activationJobs = schedule.scheduleJob('30 * * * * *', function() {
  // 每30秒读取一次Kue的任务
  Queue().processTask('activation');
});

var newsletterJobs = schedule.scheduleJob('* * * * * 7', function() {
  console.log('process tast in newsletter');
});
