const forms = document.querySelectorAll('.validate')

for (let i = 0; i < forms.length; i++) {
  forms[i].setAttribute('novalidate', true)
}

document.addEventListener('blur', function (event) {
  let error
  if (!event.target.form.classList.contains('validate')) return
  error = hasError(event.target)

  if (error) {
    showError(event.target, error)
    return
  }

  removeError(event.target)
}, true)

function hasError (field) {
  if (field.disabled || field.type === 'file' || field === 'button' || field === 'reset' || field === 'submit') return
  
  const validity = field.validity

  if (validity.valid) return

  if (validity.valueMissing) return '必填项'

  if (validity.typeMismatch) {
    if (field.type === 'email') {
      return 'Please enter an email address'
    }
    
    if (field.type === 'url') {
      return 'Please enter an URL'
    }
  }

  if (validity.tooShort) return '字符太短'

  if (validity.tooShort) return '字符太长'

  if (validity.badInput) return '数字输入类型错误'

  if (validity.rangeOverflow) return '数字字段的值超过max值'

  if (validity.rangeUnderflow) return '数字字段的值小于min值'

  if (validity.patternMismatch) {
    if (field.hasAttribute('title')) return field.getAttribute('title')

    return 'Please match the requested format'
  }

  return 'The value you entered for this field is invalid.'
}

function showError (field, error) {
  field.classList.add('error')
  // 如果字段是一个单选按钮并且是集合的一部分，给所有的字段添加错误类并获取集合的最后一个元素
  if (field.type === 'radio' && field.name) {
    const group = document.getElementsByName(field.name)
    if (group.length) {
      for (let i = 0; i < group.length; i++) {
        // 只检查当前字段的表单
        if (group[i].form !== field.form) continue
        group[i].classList.add('error')
      }

      field = group[group.length - 1]
    }
  }

  const id = field.id || field.name

  if (!id) return

  // 检查错误消息是否已经存在
  let message = field.form.querySelector('.error-message#message-for-' + id)

  if (!message) {
    message = document.createElement('div')
    message.className = 'error-message'
    message.id = 'message-for-' + id
    let label
    // 如果字段是一个单选按钮或复选框，把错误字段插在label后面
    if (field.type === 'radio' || field.type === 'checkbox') {
      label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode
      if (label) label.parentNode.insertBefore(message, label.nextSibing)
    }
    if (!label) field.parentNode.insertBefore(message, field.nextSibing)
  }
  // 更新错误信息
  message.innerHTML = error

  message.style.display = 'block'
  message.style.visibility = 'visible'
}

function removeError (field) {
  field.classList.remove('error')

  if (field.type === 'radio' && field.name) {
    const group = document.getElementsByName(field.name)

    if (group.length) {
      for (let = i; i < group.length; i++) {
        if (group[i].form !== field.form) continue
        group[i].classList.remove('error')
      }

      field = group[group.length - 1]
    }
  }

  const id = field.id || field.name

  if (!id) return

  const message = field.form.querySelector('.error-message#message-for-' + id)

  if (!message) return

  message.innerHTML = ''
  message.style.display = 'none'
  message.style.visibility = 'hidden'
}