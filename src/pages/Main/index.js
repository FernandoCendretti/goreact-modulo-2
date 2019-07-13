import React, { Component } from "react";
import api from "../../services/api";
import moment from "moment";

import logo from "../../assets/logo.png";
import { Container, Form } from "./styles";
import CompareList from "../../components/CompareList";

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: "",
    repositories: []
  };

  async componentDidMount() {
    this.setState({ loading: true });

    this.setState({
      loading: false,
      repositories: await this.getLocalRepositories()
    });
  }

  handleAddRepository = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { repositoryInput, repositories } = this.state;

    try {
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryInput: "",
        repositories: [...repositories, repository],
        repositoryError: false
      });

      const localRepositories = await this.getLocalRepositories();

      await localStorage.setItem(
        "@GitCompare:respositories",
        JSON.stringify([...localRepositories, repository])
      );
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  getLocalRepositories = async () =>
    JSON.parse(await localStorage.getItem("@GitCompare:respositories")) || [];

  handleRemoveRepository = async id => {
    const { repositories } = this.state;

    const updatedRepositories = repositories.filter(
      repository => repository.id !== id
    );

    this.setState({ repositories: updatedRepositories });

    await localStorage.setItem(
      "@GitCompare:respositories",
      JSON.stringify(updatedRepositories)
    );
  };

  handleUpdateRepository = async id => {
    const { repositories } = this.state;

    const repository = repositories.find(repo => repo.id === id);

    try {
      const { data } = await api.get(`/repos/${repository.full_name}`);

      data.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryError: false,
        repositoryInput: "",
        repositories: [...repositories, repository]
      });

      const localRepositories = await this.getLocalRepositories();

      await localStorage.setItem(
        "@GitCompare:respositories",
        JSON.stringify([...localRepositories, repository])
      );
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: true });
    }
  };

  render() {
    const {
      repositories,
      repositoryInput,
      repositoryError,
      loading
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="GithubCompare" />
        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {loading ? <i className="fa fa-spinner fa-pulse" /> : "OK"}
          </button>
        </Form>

        <CompareList
          repositories={repositories}
          removeRepository={this.handleRemoveRepository}
          updateRepository={this.handleUpdateRepository}
        />
      </Container>
    );
  }
}
