import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { domain, version, source_url, profile_directory as profileDirectory } from 'flavours/glitch/initial_state';
import { logOut } from 'flavours/glitch/utils/log_out';
import { openModal } from 'flavours/glitch/actions/modal';
import { PERMISSION_INVITE_USERS } from 'flavours/glitch/permissions';

const messages = defineMessages({
  logoutMessage: { id: 'confirmations.logout.message', defaultMessage: 'Are you sure you want to log out?' },
  logoutConfirm: { id: 'confirmations.logout.confirm', defaultMessage: 'Log out' },
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  onLogout () {
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.logoutMessage),
      confirm: intl.formatMessage(messages.logoutConfirm),
      closeWhenConfirm: false,
      onConfirm: () => logOut(),
    }));
  },
});

export default @injectIntl
@connect(null, mapDispatchToProps)
class LinkFooter extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleLogoutClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onLogout();

    return false;
  }

  render () {
    const { signedIn, permissions } = this.context.identity;

    const canInvite = signedIn && ((permissions & PERMISSION_INVITE_USERS) === PERMISSION_INVITE_USERS);
    const canProfileDirectory = profileDirectory;

    return (
      <div className='link-footer'>
        <p>
          <strong>{domain}</strong>:
          {' '}
          <Link key='about' to='/about'><FormattedMessage id='footer.about' defaultMessage='About' /></Link>
          {canInvite && (
            <>
              {' · '}
              <a key='invites' href='/invites' target='_blank'><FormattedMessage id='footer.invite' defaultMessage='Invite people' /></a>
            </>
          )}
          {canProfileDirectory && (
            <>
              {' · '}
              <Link key='directory' to='/directory'><FormattedMessage id='footer.directory' defaultMessage='Profiles directory' /></Link>
            </>
          )}
          {' · '}
          <Link key='privacy-policy' to='/privacy-policy'><FormattedMessage id='footer.privacy_policy' defaultMessage='Privacy policy' /></Link>
        </p>

        <p>
          <strong>Mastodon</strong>:
          {' '}
          <a href='https://joinmastodon.org' target='_blank'><FormattedMessage id='footer.about' defaultMessage='About' /></a>
          {' · '}
          <a href='https://tinyurl.com/welcome-to-mastodon' target='_blank'>Welcome Guide</a>
          {' · '}
          <a href='https://docs.google.com/document/d/1gln7Lg92Vz3TbIjz6qZkpdPOxDAe63jof5snpR4xAa0/edit#heading=h.j3jshab5bb16' target='_blank'>Mobile Applications</a>
          {' · '}
          <Link to='/keyboard-shortcuts'><FormattedMessage id='footer.keyboard_shortcuts' defaultMessage='Keyboard shortcuts' /></Link>
          {' · '}
          <a href='https://tinyurl.com/mastodon-gamedev-list' target='_blank'>Gamedev & Gaming Mastodon Webring</a>
          {' · '}
          <a href='https://glitch-soc.github.io/docs/' target='_blank'>Learn about Mastodon Glitch Edition</a>
          {' · '}
          v{version}
        </p>
      </div>
    );
  }

};
