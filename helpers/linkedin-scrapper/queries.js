/* istanbul ignore file */

const job = {
  company: {
    logo: 'section.topcard img.company-logo',
    name: 'section.topcard a.topcard__org-name-link',
    address: 'section.topcard span.topcard__flavor.topcard__flavor--bullet'
  },
  title: 'section.topcard h1.topcard__title',
  description: {
    html: 'section.description div.description__text',
    text: 'section.description div.description__text',
  }
}

const profile = {
  links: {
    login: 'a.form-toggle'
  },
  inputs: {
    email: 'input#login-email',
    password: 'input#login-password'
  },
  buttons: {
    login: 'input#login-submit',
    moreSkill: 'button.pv-skills-section__additional-skills'
  },
  photo: 'section.pv-top-card-v3 img.pv-top-card-section__photo',
  name: 'section.pv-top-card-v3 ul.pv-top-card-v3--list > li:first-child',
  currentJob: 'section.pv-top-card-v3 div.ph5.pb5 > div.display-flex.mt2 > div.flex-1.mr5 > h2',
  about: 'section.pv-about-section p.pv-about__summary-text',
  experience: {
    root: 'section#experience-section',
    items: {
      root: 'section#experience-section .pv-profile-section__list-item',
      isMulti: 'ul.pv-entity__position-group',
      company: {
        logo: 'img.pv-entity__logo-img',
        name: {
          multi: 'div.pv-entity__company-summary-info > h3 > span:last-child',
          single: 'span.pv-entity__secondary-title'
        }
      },
      position: {
        single: 'div.pv-entity__summary-info--background-section > h3',
        multi: {
          root: 'li.pv-entity__position-group-role-item',
          items: 'div.pv-entity__summary-info--background-section > h3 > span:last-child'
        },
        description: 'div.pv-entity__extra-details'
      },
    }
  },
  education: {
    root: 'section#education-section',
    items: {
      root: '.pv-education-entity',
      school: {
        logo: 'img.pv-entity__logo-img',
        name: 'h3.pv-entity__school-name'
      },
      degree: 'p.pv-entity__degree-name > span:last-child',
      field: 'p.pv-entity__fos > span:last-child'
    }
  },
  skill: {
    root: 'div#skill-categories-expanded',
    items: {
      root: 'div.pv-skill-category-list',
      title: 'h3',
      items: 'span.pv-skill-category-entity__name-text'
    }
  }
}

const company = {
  isAuth: '',
  auth: {
    links: {
      jobs: 'a[data-control-name="see_all_jobs"]'
    },
    jobs: {
      root: 'ul.jobs-search-results__list',
      items: {
        root: 'li.artdeco-list__item',
        link: 'a.job-card-search__link-wrapper',
        title: 'h1.jobs-details-top-card__job-title',
        company: {
          name: 'h1.org-top-card-summary__title',
          logo: 'img.org-top-card-primary-content__logo',
          description: 'div#job-details > span'
        }
      }
    }
  },
  links: {
    jobs: 'a.top-card__cta-button'
  },
  buttons: {
    seeMoreJobs: 'button.see-more-jobs'
  },
  company: {
    logo: 'img.company-logo',
    name: 'a.topcard__org-name-link'
  },
  jobs: {
    root: 'ul.jobs-search__results-list',
    items: {
      root: 'li.result-card',
      link: 'a.result-card__full-card-link',
      title: 'h3.result-card__title',
      company: {
        name: 'a.result-card__subtitle-link',
        logo: 'img.result-card__image',
        address: 'span.job-result-card__location'
      },
      description: {
        html: 'div.description__text',
        text: 'div.description__text'
      }
    }
  }
}

module.exports = {
  job, profile, company
}
