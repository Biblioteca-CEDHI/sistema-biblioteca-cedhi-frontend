// third-party
import { FormattedMessage } from 'react-intl';

// type
import { Home3, Book1, Convertshape, Profile2User, CpuCharge, Danger } from 'iconsax-react';

// icons
const icons = {
  navigation: Home3,
  books: Book1,
  ecommerce: Convertshape,
  customer: Profile2User,
  plugins: CpuCharge,
  sanctions: Danger
};

// ==============================|| MENU ITEMS - COMPONENTS ||============================== //

const components = {
  id: 'group-library',
  title: <FormattedMessage id="library" />,
  icon: icons.navigation,
  type: 'group',
  children: [

    {
      id: 'library',
      title: <FormattedMessage id="library" />,
      type: 'item',
      url: '/library/books',
      icon: icons.books,
      breadcrumbs: false
    },
    {
      id: 'loans',
      title: <FormattedMessage id="loans" />,
      url: '/loans/list',
      type: 'item',
      icon: icons.ecommerce,
      breadcrumbs: false,
    },
    {
      id: 'sanctions',
      title: <FormattedMessage id="sanctions" />,
      url: '/sanctions/list',
      type: 'item',
      icon: icons.sanctions,
      breadcrumbs: false,
    },
    {
      id: 'user-management',
      title: <FormattedMessage id="user-management" />,
      url: '/user-management/list',
      type: 'item',
      icon: icons.customer,
      breadcrumbs: false,
    },
    {
      id: 'file-management',
      title: <FormattedMessage id="file-management" />,
      url: '/file-management',
      type: 'item',
      icon: icons.plugins,
      breadcrumbs: false,
    },
  ]
};

{/* 

const components = {
  id: 'group-library',
  title: <FormattedMessage id="library" />,
  icon: icons.navigation,
  type: 'group',
  children: [

    {
      id: 'library',
      title: <FormattedMessage id="library" />,
      type: 'item',
      url: '/library/books',
      icon: icons.books,
      breadcrumbs: false
    },
    {
      id: 'loans',
      title: <FormattedMessage id="loans" />,
      url: '/loans/',
      type: 'collapse',
      icon: icons.ecommerce,
      breadcrumbs: false,
      children: [
        {
          id: 'list-loans',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/loans/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'sanctions',
      title: <FormattedMessage id="sanctions" />,
      url: '/sanctions/',
      type: 'collapse',
      icon: icons.sanctions,
      breadcrumbs: false,
      children: [
        {
          id: 'list-sanctions',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/sanctions/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'user-management',
      title: <FormattedMessage id="user-management" />,
      url: '/user-management/',
      type: 'collapse',
      icon: icons.customer,
      breadcrumbs: false,
      children: [
        {
          id: 'list-user-management',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/user-management/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'file-management',
      title: <FormattedMessage id="file-management" />,
      url: '/file-management/',
      type: 'collapse',
      icon: icons.plugins,
      breadcrumbs: false,
      children: [
        {
          id: 'list-file-management',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/file-management/list',
          breadcrumbs: false
        }
      ]
    },
  ]
};

*/}

export default components;
